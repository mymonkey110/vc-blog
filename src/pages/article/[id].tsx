import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 文章数据接口
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  categories: string[];
  imageUrl: string;
  imageAlt: string;
  sections: ArticleSection[];
  comments: Comment[];
}

// 文章章节接口
interface ArticleSection {
  title: string;
  content: string;
}

// 评论接口
interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  date: string;
  content: string;
}

const ArticleDetail: React.FC<{ id: string }> = ({ id }) => {
  const [commentText, setCommentText] = useState('');
  
  // 模拟文章数据
  const article: Article = {
    id: parseInt(id, 10) || 1,
    title: 'The Future of AI in Software Development',
    content: 'Artificial intelligence (AI) is rapidly transforming the software development landscape. From automating repetitive tasks to assisting with complex problem-solving, AI tools are becoming indispensable for developers. This article explores the current and future impact of AI on software development, highlighting key trends and potential challenges.',
    author: 'Sophia Chen',
    date: 'January 15, 2024',
    categories: ['人工智能', '技术趋势'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHHAYNN0OfUPzzPXlz_JMmyw7WlS_7JgOGa8ABl0HPE7LDBUhqzqvKRa04UjrUPxL03w-wvZqMNUBNkjS5nCnocFIz14Eipd7NAw0Wgg44VvnK7bsBX5LbK9wwlxPLz453mREaJipB6oqUeNwPdalsEcDFJLjM7P2C55RqYPE74GdyWg_z6xUbKsHPH7aGpeKXBqT4CmV3GFxdxu03vhuf_2omnjG8TyoSSEJRs8Pm-8XlV7UGY0W3NGmyAsqmePqUT1QIIasBezs',
    imageAlt: 'The Future of AI in Software Development',
    sections: [
      {
        title: 'Key Trends',
        content: 'Several key trends are shaping the integration of AI in software development: 1. **AI-Powered Code Generation:** Tools like GitHub Copilot are enabling developers to write code faster and more efficiently by suggesting code snippets and completing functions based on natural language prompts. 2. **Automated Testing:** AI is being used to automate various testing processes, including unit testing, integration testing, and UI testing, leading to faster feedback loops and improved software quality. 3. **Intelligent Debugging:** AI-powered debugging tools can analyze code to identify potential bugs and suggest fixes, reducing the time spent on debugging. 4. **Predictive Analytics:** AI algorithms can analyze project data to predict potential risks, estimate project timelines, and optimize resource allocation. 5. **Personalized Learning:** AI-driven platforms are providing personalized learning experiences for developers, helping them acquire new skills and stay up-to-date with the latest technologies.'
      },
      {
        title: 'Potential Challenges',
        content: 'While AI offers numerous benefits, it also presents some challenges: 1. **Data Privacy and Security:** AI models require large amounts of data to train, raising concerns about data privacy and security. 2. **Bias and Fairness:** AI algorithms can inherit biases from the data they are trained on, leading to unfair or discriminatory outcomes. 3. **Job Displacement:** The automation of certain tasks may lead to job displacement for some developers, requiring them to adapt to new roles and responsibilities. 4. **Ethical Considerations:** The use of AI in software development raises ethical questions about accountability, transparency, and the potential impact on society.'
      },
      {
        title: 'Conclusion',
        content: 'AI is poised to revolutionize software development, offering significant opportunities for increased productivity, improved quality, and enhanced innovation. However, it is crucial to address the challenges and ethical considerations associated with AI to ensure its responsible and beneficial integration into the development process. As AI continues to evolve, developers must embrace lifelong learning and adapt to the changing landscape to remain competitive and contribute to the future of software.'
      }
    ],
    comments: [
      {
        id: 1,
        author: 'David Lee',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFD92tzkp4lvlLDDYnYKHIG5i0LuI6HFUbKai-gzM60AgvkXnvHgtc4xe4i9wmp0D3asxdAvMaUiWdXAb2vftCxXJBqBrlgpxhUfIhCBKGdzBteNF6cAXRRErB8NJIOUChH5AdEfjl1OW54uC6_jpyTcgWsBnW3BgEqYt2HoVS5fzboMgDtTUAdjk7-gqh4Jj7wcJ43Z1H30zLz0_TM0LMkfHCVXsCha5Ms6IBjxuXiii_vkJu1VR2CubUNBPnTWvZrmfNFTGSEqY',
        date: '2 days ago',
        content: 'Great article! I\'m particularly interested in the potential of AI-powered code generation. It could significantly speed up development cycles.'
      },
      {
        id: 2,
        author: 'Emily Wong',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvvBfT-_jSfyZDxg2smWERp5UMSIoatxcpv-t70BSRxvJ8pumsT8Kg_Mm514vK0S54shuxohaDDCdDyj5GcW6kgZGRzgxVYPRevrDiBBdB2HOrsTHnNs0_szxr6tEQVipC8ipCA9lagRgiLZ4-XPukNqbjqOnPgJJtQckcSiAVp4Vu6ndHYl5etH65yDogxrvLVw6Y6YKnGXzdbo8TSzHrCqxAClL2yBMggnUKvIgpL6n_CxqCmFEwRJ6bc4CEkXgzc6HQ4CLiQFE',
        date: '1 day ago',
        content: 'I agree with David. The ethical considerations are also important to keep in mind. We need to ensure AI is used responsibly in software development.'
      }
    ]
  };

  // 处理Markdown格式的文本，将**text**转换为<strong>text</strong>
  const formatContent = (content: string) => {
    return content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // 这里可以添加实际的评论提交逻辑
      console.log('提交评论:', commentText);
      setCommentText('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 头部导航 */}
      <header className="flex items-center justify-between border-b border-background px-10 py-3 whitespace-nowrap">
        <div className="flex items-center gap-4 text-primary-text">
          <div className="size-4">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Blog</h2>
        </div>
        
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link href="/" className="text-sm font-medium leading-normal">首页</Link>
            <Link href="/categories" className="text-sm font-medium leading-normal">分类</Link>
            <Link href="/about" className="text-sm font-medium leading-normal">关于</Link>
          </div>
          <div className="flex gap-2">
            <button className="flex h-10 items-center justify-center rounded-lg bg-background px-2.5 text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="flex h-10 items-center justify-center rounded-lg bg-background px-2.5 text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
          <div 
            className="h-10 w-10 overflow-hidden rounded-full bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxrPMJGAMy0YG9xlDQAnsTcuefqv0Nx_AjlOP738Z1aw4OqSQr1cC1AdALPA8ugGs-ipzC_a8GmuJjh5i8Vd3nhtwPF2KPPyTNhlFlhhjFhJ8XGQdQqKzw1X58AY2ZiFlBeBCvIuO3MkKLwQndI_4MXw5fpDyN669Y1jxQOCW0Q7-8NbfzAiIRudvbhCF84xeofJveRU-e28_n9eEAGWT6L8U61OU4CAfXyQsmm_gb3zDKezqJFHg0D6sw9pnt3YtK2HglD15m6yk")' }}
          />
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex flex-1 justify-center px-40 py-5">
        <div className="flex max-w-[960px] flex-1 flex-col">
          {/* 文章标题 */}
          <h1 className="px-4 pt-5 text-2xl font-bold leading-tight tracking-light">{article.title}</h1>
          
          {/* 作者信息和分类 */}
          <div className="px-4 py-1">
            <p className="text-sm text-secondary-text">By {article.author} · Published on {article.date}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {article.categories.map((category, index) => (
                <Link 
                  key={index} 
                  href={`/categories/${category}`} 
                  className="text-xs text-secondary-text hover:underline"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          
          {/* 文章封面图 */}
          <div className="w-full p-4">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
          
          {/* 文章简介 */}
          <p className="px-4 py-3 text-base leading-normal">{formatContent(article.content)}</p>
          
          {/* 文章主体内容 */}
          {article.sections.map((section, index) => (
            <div key={index} className="px-4 py-3">
              <h2 className="py-2 text-lg font-bold leading-tight tracking-[-0.015em]">{section.title}</h2>
              <p className="text-base leading-normal">{formatContent(section.content)}</p>
            </div>
          ))}
          
          {/* 评论区标题 */}
          <h2 className="px-4 py-3 text-2xl font-bold leading-tight tracking-[-0.015em]">Comments</h2>
          
          {/* 评论列表 */}
          {article.comments.map((comment) => (
            <div key={comment.id} className="flex w-full gap-3 p-4">
              <div 
                className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${comment.authorAvatar})` }}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex gap-3">
                  <p className="text-sm font-bold leading-normal tracking-[0.015em]">{comment.author}</p>
                  <p className="text-sm text-secondary-text">{comment.date}</p>
                </div>
                <p className="text-sm leading-normal">{comment.content}</p>
              </div>
            </div>
          ))}
          
          {/* 添加评论区域 */}
          <form onSubmit={handleCommentSubmit} className="px-4 py-3">
            <textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[144px] w-full resize-none rounded-lg border border-[#e5e2dc] bg-white p-4 text-base leading-normal placeholder:text-secondary-text transition-all duration-200 focus:border-[#e6a219] focus:outline-none focus:ring-2 focus:ring-[#e6a219] focus:ring-opacity-20"
              required
            />
            <div className="flex justify-end py-3">
              <button
                type="submit"
                className="min-w-[84px] h-10 cursor-pointer overflow-hidden rounded-lg bg-[#e6a219] px-4 font-bold text-sm leading-normal tracking-[0.015em] hover:bg-[#d39217] transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

export async function getServerSideProps(context: { params: { id: string } }) {
  const { id } = context.params;
  // 这里可以添加从API获取实际文章数据的逻辑
  return {
    props: { id }
  };
}