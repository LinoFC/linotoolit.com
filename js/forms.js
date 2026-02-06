// forms.js
// Handles application submissions:
// 1. Sends to Formspree (email)
// 2. Sends to Discord via webhook (embed)

async function submitApp(event, appName) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Convert form data to object
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value || "N/A";
  });

  /* ===============================
     1️⃣ SEND TO EMAIL (FORMSPREE)
     =============================== */
  try {
    await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json"
      }
    });
  } catch (err) {
    alert("Error sending application email.");
    return;
  }

  /* ===============================
     2️⃣ SEND TO DISCORD (WEBHOOK)
     =============================== */
  const embedFields = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: value.length > 1024 ? value.substring(0, 1021) + "..." : value,
    inline: false
  }));

  const webhookPayload = {
    username: "LinoToolIt Applications",
    embeds: [
      {
        title: appName,
        description: "📥 New application submitted",
        color: 3447003,
        fields: embedFields,
        footer: {
          text: "LinoToolIt | GTA 5 PS5 Roleplay"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch("https://discord.com/api/webhooks/1450567055412826272/DMSA3CBnkgaLMVPAKjpTUu1B_pRLcprN2opShZijFyGZKrmedCfMlNSnoWFg-JaNz0iB", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(webhookPayload)
    });
  } catch (err) {
    alert("Application submitted, but Discord delivery failed.");
    return;
  }

  alert("✅ Application submitted successfully!");
  form.reset();
}