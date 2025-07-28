function resetPasswordTemplate(link) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">🔐 Reset Your Password</h2>
      <p style="font-size: 16px; color: #555;">
        You recently requested to reset your password. Click the button below to continue:
      </p>
      <a href="${link}" style="display: inline-block; margin-top: 20px; background-color: #0081FB; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Click to Reset Password
      </a>
      <p style="margin-top: 30px; font-size: 14px; color: #888;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;
}

module.exports = { resetPasswordTemplate };
