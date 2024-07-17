import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Block, Topic, Text, Chart } from "@/types/blockTypes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "3", 10);
  const offset = (page - 1) * limit;

  try {
    // Fetch blocks with topics, texts, and charts
    const blocks = await prisma.block.findMany({
      include: {
        topics: {
          include: {
            texts: true,
            charts: true,
          },
        },
      },
    });

    // Type casting the fetched data to Block[]
    const typedBlocks = blocks as unknown as Block[];

    // Flatten topics and include block name
    const allTopics: Topic[] = typedBlocks.flatMap((block: Block) =>
      block.topics.map((topic: Topic) => ({
        ...topic,
        blockName: block.name,
        // Combine texts and charts into a single array and sort by creation date
        items: [...topic.texts, ...topic.charts].sort(
          (a: Text | Chart, b: Text | Chart) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      }))
    );

    // Paginate the sorted topics
    const paginatedTopics = allTopics.slice(offset, offset + limit);
    const totalTopics = allTopics.length;

    return NextResponse.json({ topics: paginatedTopics, totalTopics });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching block data" },
      { status: 500 }
    );
  }
}
