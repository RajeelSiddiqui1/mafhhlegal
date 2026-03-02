import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASS
  }
})

export async function sendEmail(to: string | string[], subject: string, html: string) {
  try {
    const recipients = Array.isArray(to) ? to.join(", ") : to
    
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: recipients,
      subject: subject,
      html: html
    })
    
    console.log(`Email sent successfully to: ${recipients}`)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

export async function sendAppointmentCreatedEmail(
  userEmail: string,
  userName: string,
  appointmentDetails: {
    firstName: string
    lastName: string
    description: string
    preferredDate: string
    preferredTime: string
    area: string
  }
) {
  const subject = "Appointment Created Successfully"
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Appointment Created Successfully</h2>
      <p>Dear ${userName},</p>
      <p>Your appointment has been created successfully. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${appointmentDetails.firstName} ${appointmentDetails.lastName}</p>
        <p><strong>Description:</strong> ${appointmentDetails.description}</p>
        <p><strong>Date:</strong> ${appointmentDetails.preferredDate}</p>
        <p><strong>Time:</strong> ${appointmentDetails.preferredTime}</p>
        <p><strong>Area:</strong> ${appointmentDetails.area}</p>
      </div>
      <p>Your appointment status is <strong>Pending</strong>. We will review your request and get back to you soon.</p>
      <p>Thank you for choosing our service!</p>
      <p>Best regards,<br/>MAFHH Legal Team</p>
    </div>
  `
  
  return sendEmail(userEmail, subject, html)
}

export async function sendAppointmentStatusUpdateEmail(
  userEmail: string,
  userName: string,
  status: string,
  appointmentDetails: {
    firstName: string
    lastName: string
    description: string
    preferredDate: string
    preferredTime: string
    area: string
  }
) {
  const subject = `Appointment Status Updated - ${status}`
  const statusColor = status === "Completed" ? "green" : status === "Rejected" ? "red" : "orange"
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Appointment Status Updated</h2>
      <p>Dear ${userName},</p>
      <p>Your appointment status has been updated. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${appointmentDetails.firstName} ${appointmentDetails.lastName}</p>
        <p><strong>Description:</strong> ${appointmentDetails.description}</p>
        <p><strong>Date:</strong> ${appointmentDetails.preferredDate}</p>
        <p><strong>Time:</strong> ${appointmentDetails.preferredTime}</p>
        <p><strong>Area:</strong> ${appointmentDetails.area}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
      </div>
      <p>We appreciate your patience. If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br/>MAFHH Legal Team</p>
    </div>
  `
  
  return sendEmail(userEmail, subject, html)
}

export async function sendNewAppointmentNotificationToAdmins(
  adminEmails: string[],
  appointmentDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    description: string
    preferredDate: string
    preferredTime: string
    area: string
    createdAt: string
  }
) {
  const subject = "New Appointment Created"
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Appointment Created</h2>
      <p>Dear Admin,</p>
      <p>A new appointment has been created. Please review the details below:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${appointmentDetails.firstName} ${appointmentDetails.lastName}</p>
        <p><strong>Email:</strong> ${appointmentDetails.email}</p>
        <p><strong>Phone:</strong> ${appointmentDetails.phone}</p>
        <p><strong>Description:</strong> ${appointmentDetails.description}</p>
        <p><strong>Preferred Date:</strong> ${appointmentDetails.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${appointmentDetails.preferredTime}</p>
        <p><strong>Area:</strong> ${appointmentDetails.area}</p>
        <p><strong>Created At:</strong> ${appointmentDetails.createdAt}</p>
      </div>
      <p>Please log in to the admin panel to review and update the status.</p>
      <p>Best regards,<br/>MAFHH Legal System</p>
    </div>
  `
  
  return sendEmail(adminEmails, subject, html)
}
