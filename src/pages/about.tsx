import React from 'react';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 头部导航 */}
      <header className="flex items-center justify-between border-b border-[#f4f3f0] px-10 py-3 whitespace-nowrap">
        <div className="flex items-center gap-4 text-[#181511]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-[#181511] text-lg font-bold leading-tight tracking-[-0.015em]">技术博客</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link href="/" className="text-[#181511] text-sm font-medium leading-normal">首页</Link>
            <Link href="/article" className="text-[#181511] text-sm font-medium leading-normal">文章</Link>
            <Link href="/about" className="text-[#181511] text-sm font-medium leading-normal">关于我</Link>
          </div>
          <div className="flex gap-2">
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f4f3f0] text-[#181511] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </button>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f4f3f0] text-[#181511] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>
            </button>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCd8lJNh4wF2Yus2iaaJNm-MGlK_CnlCc3ATVeEhe1oIceztO86stEfvBmEb_m0c2fYPqgcbOglh5D9r19PxB2O4q3An4Sq3---EtDvDd62ZoBoB12J275CUcFtPlYjexfoH9AlQ2ayejMK4mI8u0S_g4AoZrXJw50l3zvW3zX0K05EPOYivMVrxghpITgwF2Z0XKNaTezZaAJTyCk5v3poBUt3vM9qh1BTkVeDfdYobRhKR7qcQUZzpx2xVJvlzYyjfLjzf9g0sTI")' }}
          ></div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex flex-1 justify-center px-40 py-5">
        <div className="flex max-w-[960px] flex-1 flex-col">
          {/* 页面标题 */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#181511] tracking-light text-[32px] font-bold leading-tight min-w-72">关于我</p>
          </div>
          
          {/* 个人信息 */}
          <div className="flex p-4">
            <div className="flex w-full flex-col gap-4 items-center">
              <div className="flex gap-4 flex-col items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuANQU7w1tNRkdVGksMVRPurHdVTqFea7sAatIS7qMs-4dXrrdyOEX7ngarsPt4QEp9u7AjrntWRcVGO5vd7QipVhZet79ao9Nh_3jSeLscNYNr5YGKe4TJm4gVKQuka4NlOnF6ZZrxuS0zAIafHwAebjDY0GplTsw-mrpY0ABvi8rGHmWXRpP3-yUVJvY5QejrZo8NTrLNV3AnFGE6FnIfx3YrZMtyk8ORZ89ZOThBvHoMSdyuZTa0UdlfJdyXHwralxC3ON1EjHSI")' }}
                ></div>
                <div className="flex flex-col items-center justify-center justify-center">
                  <p className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">艾米丽·陈</p>
                  <p className="text-[#887c63] text-base font-normal leading-normal text-center">技术爱好者，热爱分享</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 学习工作经历 */}
          <h2 className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">我的学习工作经历</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
            <div className="flex flex-col items-center gap-1 pt-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-[#181511] text-base font-medium leading-normal">软件工程师</p>
              <p className="text-[#887c63] text-base font-normal leading-normal">2020年至今</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-[#e5e2dc] h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-[#181511] text-base font-medium leading-normal">大数据分析师</p>
              <p className="text-[#887c63] text-base font-normal leading-normal">2018年 - 2020年</p>
            </div>
            <div className="flex flex-col items-center gap-1 pb-3">
              <div className="w-[1.5px] bg-[#e5e2dc] h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"></path>
              </svg>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-[#181511] text-base font-medium leading-normal">计算机科学学士</p>
              <p className="text-[#887c63] text-base font-normal leading-normal">2014年 - 2018年</p>
            </div>
          </div>
          
          {/* 感兴趣的领域 */}
          <h2 className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">我目前感兴趣的领域</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
            <div className="flex flex-col items-center gap-1 pt-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-[#181511] text-base font-medium leading-normal">编程（Python，JavaScript，Go）</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-[#e5e2dc] h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-[#181511] text-base font-medium leading-normal">云计算（AWS，Azure，GCP）</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-[#e5e2dc] h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-[#181511] text-base font-medium leading-normal">大数据分析</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-[#e5e2dc] h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M152,96H104a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V104A8,8,0,0,0,152,96Zm-8,48H112V112h32Zm88,0H216V112h16a8,8,0,0,0,0-16H216V56a16,16,0,0,0-16-16H160V24a8,8,0,0,0-16,0V40H112V24a8,8,0,0,0-16,0V40H56A16,16,0,0,0,40,56V96H24a8,8,0,0,0,0,16H40v32H24a8,8,0,0,0,0,16H40v40a16,16,0,0,0,16,16H96v16a8,8,0,0,0,16,0V216h32v16a8,8,0,0,0,16,0V216h40a16,16,0,0,0,16-16V160h16a8,8,0,0,0,0-16Zm-32,56H56V56H200v95.87s0,.09,0,.13,0,.09,0,.13V200Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-[#181511] text-base font-medium leading-normal">机器学习</p>
            </div>
            <div className="flex flex-col items-center gap-1 pb-3">
              <div className="w-[1.5px] bg-[#e5e2dc] h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM101.63,168h52.74C149,186.34,140,202.87,128,215.89,116,202.87,107,186.34,101.63,168ZM98,152a145.72,145.72,0,0,1,0-48h60a145.72,145.72,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.79a161.79,161.79,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154.37,88H101.63C107,69.66,116,53.13,128,40.11,140,53.13,149,69.66,154.37,88Zm19.84,16h38.46a88.15,88.15,0,0,1,0,48H174.21a161.79,161.79,0,0,0,0-48Zm32.16-16H170.94a142.39,142.39,0,0,0-20.26-45A88.37,88.37,0,0,1,206.37,88ZM105.32,43A142.39,142.39,0,0,0,85.06,88H49.63A88.37,88.37,0,0,1,105.32,43ZM49.63,168H85.06a142.39,142.39,0,0,0,20.26,45A88.37,88.37,0,0,1,49.63,168Zm101.05,45a142.39,142.39,0,0,0,20.26-45h35.43A88.37,88.37,0,0,1,150.68,213Z"></path>
              </svg>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-[#181511] text-base font-medium leading-normal">Web 开发</p>
            </div>
          </div>
          
          {/* 联系方式 */}
          <h2 className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">联系方式</h2>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5e2dc] py-5">
              <p className="text-[#887c63] text-sm font-normal leading-normal">邮箱</p>
              <p className="text-[#181511] text-sm font-normal leading-normal">mymonkey110@163.com</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5e2dc] py-5">
              <p className="text-[#887c63] text-sm font-normal leading-normal">GitHub</p>
              <p className="text-[#181511] text-sm font-normal leading-normal">github.com/mymonkey110</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#e5e2dc] py-5">
              <p className="text-[#887c63] text-sm font-normal leading-normal">个人主页</p>
              <p className="text-[#181511] text-sm font-normal leading-normal">michael-j.net</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;