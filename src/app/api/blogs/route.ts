import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// File path for storing blogs
const BLOGS_FILE_PATH = path.join(process.cwd(), "data", "blogs.json");

// Default blogs for initial setup
const defaultBlogs: Array<{
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
}> = [
  {
    id: "1",
    title: "The Benefits of Meditation in Modern Life",
    content:
      "Meditation has become increasingly important in our fast-paced world. This ancient practice offers numerous benefits for both mental and physical health. Regular meditation can reduce stress, improve focus, enhance emotional well-being, and even boost immune function.\n\nStarting a meditation practice doesn't require any special equipment or extensive training. Even just 5-10 minutes a day can make a significant difference in your overall quality of life.\n\nSome simple techniques to get started include:\n- Focused breathing exercises\n- Body scan meditation\n- Mindfulness of daily activities\n- Loving-kindness meditation\n\nThe key is consistency rather than duration. Start small and gradually build your practice over time.",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    author: "Sarah Johnson",
  },
  {
    id: "2",
    title: "AI and the Future of Creative Writing",
    content:
      "Artificial Intelligence is revolutionizing the way we approach creative writing. From generating ideas to assisting with grammar and style, AI tools are becoming indispensable companions for writers.\n\nHowever, this doesn't mean AI will replace human creativity. Instead, it serves as a powerful tool that can:\n- Help overcome writer's block\n- Suggest alternative phrasings\n- Generate creative prompts\n- Assist with research and fact-checking\n\nThe future of writing lies in the collaboration between human creativity and AI assistance, creating a new era of enhanced storytelling and communication.",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    author: "Tech Enthusiast",
  },
  {
    id: "3",
    title: "Sustainable Living: Small Changes, Big Impact",
    content:
      "Living sustainably doesn't require dramatic lifestyle changes. Small, consistent actions can create significant positive environmental impact.\n\nSimple steps you can take today:\n- Reduce single-use plastics\n- Choose local and seasonal produce\n- Use energy-efficient appliances\n- Practice water conservation\n- Support eco-friendly businesses\n\nEvery small action contributes to a larger movement toward environmental responsibility. Together, we can create a more sustainable future for generations to come.",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    author: "Green Living Guide",
  },
];

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read blogs from file
async function readBlogs() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(BLOGS_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is corrupted, return default blogs
    console.log("No blogs file found, using defaults");
    await writeBlogs(defaultBlogs);
    return defaultBlogs;
  }
}

// Write blogs to file
async function writeBlogs(
  blogs: Array<{
    id: string;
    title: string;
    content: string;
    publishedAt: string;
    author: string;
  }>
) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(BLOGS_FILE_PATH, JSON.stringify(blogs, null, 2));
  } catch (error) {
    console.error("Error writing blogs to file:", error);
  }
}

// GET - Fetch all published blogs
export async function GET() {
  try {
    const blogs = await readBlogs();
    // Sort blogs by published date (newest first)
    const sortedBlogs = blogs.sort(
      (a: { publishedAt: string }, b: { publishedAt: string }) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({ blogs: sortedBlogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { blogs: [], error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST - Publish a new blog
export async function POST(req: Request) {
  try {
    const { title, content, author } = await req.json();

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create new blog entry
    const newBlog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      content: content.trim(),
      publishedAt: new Date().toISOString(),
      author: author?.trim() || "Anonymous",
    };

    // Read existing blogs and add new one
    const existingBlogs = await readBlogs();
    existingBlogs.push(newBlog);
    await writeBlogs(existingBlogs);

    console.log("Blog published:", newBlog.title);

    return NextResponse.json({
      success: true,
      blog: newBlog,
      message: "Blog published successfully!",
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("Publish blog error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
