const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const moment = require("moment");
const schedule = require("node-schedule");
const port = 5000;
require("dotenv").config();

const EMAIL_USER = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.PASSWORD;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH;
const TWILIO_MOBILE = process.env.MOBILE;
console.log(EMAIL_USER, EMAIL_PASSWORD);
const app = express();
app.use(express.json());
app.use(cors());

const usersRoutes = require("./routes/userRoute");
const medicationRemindersRoutes = require("./routes/reminderRoute");
const caregiversRoutes = require("./routes/caregiverRoute");
const MedicationReminder = require("./models/medicationRemonder");

mongoose
  .connect("mongodb://127.0.0.1:27017/medicineReminder")
  .then(() => {
    console.log("Mongo is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Use the imported routes
app.use("/auth", usersRoutes);
app.use("/reminders", medicationRemindersRoutes);
app.use("/caregivers", caregiversRoutes);

// Configure nodemailer
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Configure Twilio
const twilioClient = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

// Function to send notifications (email or SMS)
function sendNotification(recipient, subject, message, notificationType) {
  if (notificationType === "email") {
    const mailOptions = {
      from: EMAIL_USER,
      to: recipient.email,
      subject: subject,
      text: message,
    };

    console.log("email send");

    emailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email notification failed:", error);
      } else {
        console.log("Email notification sent:", info.response);
      }
    });
  } else if (notificationType === "sms") {
    console.log("sms send");

    twilioClient.messages
      .create({
        body: message,
        from: TWILIO_MOBILE,
        to: recipient.phone,
      })
      .then((message) => console.log("SMS notification sent:", message.sid))
      .catch((error) => console.error("SMS notification failed:", error));
  }
}

function sendNotifications(reminder) {
  const user = reminder.user;
  const caregiver = reminder.caregiver;

  // Send email notification to the user
  const userEmailMessage = `Hello ${user.username}, it's time to take your medication: ${reminder.name}.`;
  sendNotification(user, "Medication Reminder", userEmailMessage, "email");

  // Send SMS notification to the user
  // const userSMSMessage = `Hello ${user.username}, it's time to take your medication: ${reminder.name}.`;
  // sendNotification(user, null, userSMSMessage, "sms");

  if (caregiver) {
    // Send email notification to the caregiver
    const caregiverEmailMessage = `Hello ${caregiver.name}, 
    please remind ${user.username} to take their medication: ${reminder.name}.`;
    sendNotification(
      caregiver,
      "Medication Reminder",
      caregiverEmailMessage,
      "email"
    );

    // Send SMS notification to the caregiver
    const caregiverSMSMessage = `Hello ${caregiver.name}, please remind ${user.username} to take their medication: ${reminder.name}.`;
    sendNotification(caregiver, null, caregiverSMSMessage, "sms");
  }

  updateDate(reminder);
}

async function updateDate(reminder) {
  const frequency = reminder.frequency.toLowerCase();
  // Calculate the next reminder time based on frequency
  let nextReminderTime;
  if (frequency === "daily") {
    nextReminderTime = moment(reminder.time).add(1, "day").toDate();
    // Update the reminder with the new time in the database
    MedicationReminder.findByIdAndUpdate(
      reminder._id,
      { $set: { time: nextReminderTime } },
      { new: true }
    )
      .then((updatedReminder) => {
        console.log("Reminder updated with next time:", updatedReminder.time);
      })
      .catch((err) => {
        console.error("Error updating reminder time:", err);
      });
  } else if (frequency === "weekly") {
    nextReminderTime = moment(reminder.time).add(7, "days").toDate();
    // Update the reminder with the new time in the database
    MedicationReminder.findByIdAndUpdate(
      reminder._id,
      { $set: { time: nextReminderTime } },
      { new: true }
    )
      .then((updatedReminder) => {
        console.log("Reminder updated with next time:", updatedReminder.time);
      })
      .catch((err) => {
        console.error("Error updating reminder time:", err);
      });
  } else {
    console.log(reminder);
    MedicationReminder.findByIdAndRemove(reminder._id)
      .then(() => {
        console.log("deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const checkAndSendNotifications = async (reminder) => {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = currentDateTime.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDateTime.getDate();
  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();
  // Format the components to match the desired format
  const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.000Z`;

  const time = formattedDate.toLocaleString();
  const reminderTime = new Date(reminder.time).toISOString();

  console.log(time);
  // Check if the current time and date match the reminder time
  if (time == reminderTime) {
    try {
      sendNotifications(reminder);
    } catch (error) {
      console.error("Error sending notifications:", error);
      // Handle the error as needed (e.g., retry, log, notify administrators)
    }
  }
};

const scheduleNotifications = () => {
  // Schedule the task to run every second
  const job = schedule.scheduleJob("*/1 * * * * *", async () => {
    const reminders = await MedicationReminder.find({})
      .populate("user", "-password")
      .populate("caregiver");

    reminders?.forEach((reminder) => {
      if (reminder.time) {
        checkAndSendNotifications(reminder);
      } else {
        console.error(`Invalid time for reminder: ${reminder._id}`);
      }
    });
  });
};

scheduleNotifications();

app.listen(port, () => console.log(`Server running on ${port}!`));
