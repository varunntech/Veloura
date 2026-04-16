import { toast } from 'sonner';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER = {
  name: "Veloura Luxury Fashion",
  email: "varunrajput841428@gmail.com" // You can change this to your actual sender email
};

export const sendWelcomeEmail = async (toEmail: string, toName: string) => {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API Key not found. Skipping email.");
    return false;
  }

  const htmlContent = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #f59e0b;">
        <h1 style="color: #f59e0b; font-size: 32px; margin: 0;">Veloura</h1>
      </div>
      <div style="padding: 40px 20px;">
        <h2 style="font-size: 24px; font-weight: normal;">Welcome to the Elite, ${toName}.</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          We are thrilled to welcome you to Veloura. Your account has been successfully created.
          As a member, you now have exclusive access to our premium collections, member-only discounts, and personalized style recommendations.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://veloura.com/shop" style="background-color: #0f172a; color: #f59e0b; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Explore the Collection</a>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        &copy; ${new Date().getFullYear()} Veloura Luxury Fashion. All rights reserved.
      </div>
    </div>
  `;

  try {
    const response = await fetch(BREVO_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: toEmail, name: toName }],
        subject: "Welcome to Veloura Luxury Fashion",
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo API Error:", errorText);
      toast.error(`Brevo Email Error: ${errorText}`);
      throw new Error(`Email failed: ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    toast.error("Network or Setup Error trying to reach Brevo.");
    return false;
  }
};

export const sendOrderEmail = async (toEmail: string, customerName: string, orderId: string, totalAmount: number) => {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API Key not found. Skipping email.");
    return false;
  }

  const htmlContent = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #f59e0b;">
        <h1 style="color: #f59e0b; font-size: 32px; margin: 0;">Veloura</h1>
      </div>
      <div style="padding: 40px 20px;">
        <h2 style="font-size: 24px; font-weight: normal;">Thank you for your order, ${customerName}.</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          We have received your order <strong>#${orderId}</strong> for the amount of <strong>₹${totalAmount.toLocaleString()}</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          Your masterfully crafted pieces are currently being prepared for shipment. You will receive another email once your package has been dispatched.
        </p>
      </div>
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        &copy; ${new Date().getFullYear()} Veloura Luxury Fashion. All rights reserved.
      </div>
    </div>
  `;

  try {
    const response = await fetch(BREVO_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: toEmail, name: customerName }],
        subject: `Order Confirmation #${orderId} - Veloura`,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo API Error:", errorText);
      toast.error(`Brevo Email Error: ${errorText}`);
      throw new Error(`Email failed: ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error("Error sending order email:", error);
    toast.error("Network or Setup Error trying to reach Brevo.");
    return false;
  }
};
