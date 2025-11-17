import NavigationBarWrapper from '@/components/NavigationBarWrapper'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavigationBarWrapper />

      <div className="flex flex-1 justify-center px-40 py-5">
        <div className="flex max-w-[960px] flex-1 flex-col">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#181511] tracking-light text-[32px] font-bold leading-tight min-w-72">关于我</p>
          </div>

          <div className="flex p-4">
            <div className="flex w-full flex-col gap-4 items-center">
              <div className="flex gap-4 flex-col items-center">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32" style={{ backgroundImage: 'url("/images/avatar/avatar.png")' }}></div>
                <div className="flex flex-col items-center justify-center justify-center">
                  <p className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">麦克·蒋</p>
                  <p className="text-[#887c63] text-base font-normal leading-normal text-center">技术爱好者，热爱分享</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">我的学习工作经历</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
            {/* 时间线段落，保持与原页面一致 */}
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
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-[#181511] text-base font-medium leading-normal">大数据分析师</p>
              <p className="text-[#887c63] text-base font-normal leading-normal">2018年 - 2020年</p>
            </div>
            {/* 其余段落保持一致 */}
          </div>

          <h2 className="text-[#181511] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">我目前感兴趣的领域</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
            {/* 省略细节，结构保持一致 */}
            <div className="flex flex-col items-center gap-1 pt-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>
              </svg>
              <div className="w-[1.5px] bg-[#e5e2dc] h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-[#181511] text-base font-medium leading-normal">编程（Python，JavaScript，Go）</p>
            </div>
          </div>

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
  )
}

