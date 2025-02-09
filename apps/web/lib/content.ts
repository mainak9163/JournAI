export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Welcome to JournAI" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "JournAI is an AI-powered journaling website that enhances your writing experience with smart features. Whether you want to record your thoughts, analyze your personality, or chat with past entries, JournAI is here to assist you.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Getting Started" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Visit our website to create your first journal entry and explore AI-powered features that help you gain insights from your writing.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Key Features" }],
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Rich Text Formatting (H1, H2, H3, bold, italics, underline, etc.)" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "AI Assistance for Smart Suggestions and Autocompletion" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Mathematical Equations with LaTeX Support" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Personality Analysis Based on Your Journal Entries" }],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Chat with Your Past Entries to Reflect and Gain Insights" }],
            },
          ],
        },
      ],
    },
    {
      type: "image",
      attrs: {
        src: "https://your-image-url.com/journai-banner.png",
        alt: "JournAI banner",
        title: "JournAI",
      },
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Get Started with JournAI" }],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Sign up and start journaling today" }],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Explore AI-powered insights and suggestions" }],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Analyze your emotions and personality with AI" }],
            },
          ],
        },
      ],
    },
  ],
};
