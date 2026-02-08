export const aiChatHandler = async (req, res) => {
  const { message } = req.body;

  let reply = "Sorry, I didn’t understand that.";

  const msg = message.toLowerCase();

  if (msg.includes("job")) {
    reply =
      "You can search jobs by title, location, or skills. Make sure your profile is updated for better recommendations.";
  } else if (msg.includes("resume")) {
    reply =
      "Keep your resume short, highlight skills, and include real project experience.";
  } else if (msg.includes("skill")) {
    reply =
      "Popular skills right now are React, Node.js, MongoDB, AWS, and Docker.";
  } else if (msg.includes("interview")) {
    reply =
      "Prepare by reviewing job requirements, practicing common questions, and showcasing your projects.";
  }

  res.status(200).json({
    success: true,
    reply,
  });
};
