import Image from 'next/image'

export const metadata = {
  title: '关于我 - 修行码农',
  description: '了解更多关于我的信息，包括学习工作经历和技术兴趣',
}

export default function AboutPage() {
  return (
    <div className="flex flex-1 justify-center px-40 py-5">
      <div className="flex max-w-[960px] flex-1 flex-col">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="title-1 min-w-72">关于我</p>
          </div>

          <div className="flex p-4">
            <div className="flex w-full flex-col gap-4 items-center">
              <div className="flex gap-4 flex-col items-center">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32">
                  <Image src="/images/avatar/avatar.png" alt="avatar" className="rounded-full"
                  width={200} height={200} />
                </div>
                <div className="flex flex-col items-center justify-center justify-center">
                  <p className="title-3 text-center">麦克·蒋</p>
                  <p className="text-lg font-body text-secondary-text text-center">技术爱好者，热爱分享</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="title-3 px-4 pb-3 pt-5">我的学习工作经历</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
            {/* 时间线段落，保持与原页面一致 */}
            <div className="flex flex-col items-center gap-1 pt-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">上海某大厂</p>
              <p className="text-base font-body text-secondary-text leading-normal">2020.7 - 至今</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">网易云计算</p>
              <p className="text-base font-body text-secondary-text leading-normal">2016.9 - 2020.5</p>
            </div>
            
            {/* 2015.8 - 2016.8 加入IoT创业公司 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,152a8,8,0,0,1-8,8h-32a8,8,0,0,1,0-16h32A8,8,0,0,1,224,152Zm-56,0a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h72A8,8,0,0,1,168,152Zm-88,0a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H24a8,8,0,0,1,8-8H56a8,8,0,0,1,8,8Zm176-32a8,8,0,0,1-8,8h-32a8,8,0,0,1,0-16h32A8,8,0,0,1,200,120Zm-56,0a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h72A8,8,0,0,1,144,120Zm-88,0a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H24a8,8,0,0,1,8-8H56a8,8,0,0,1,8,8Zm176-32a8,8,0,0,1-8,8h-32a8,8,0,0,1,0-16h32A8,8,0,0,1,176,88Zm-56,0a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h72A8,8,0,0,1,120,88Zm-88,0a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H24a8,8,0,0,1,8-8H56a8,8,0,0,1,8,8Zm104,96a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,144,184Zm-88,0a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H24a8,8,0,0,1,8-8H56a8,8,0,0,1,8,8Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">加入IoT创业公司</p>
              <p className="text-base font-body text-secondary-text leading-normal">2015.8 - 2016.8</p>
            </div>
            
            {/* 2014.7 - 2015.7 毕业后加入天猫 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,120Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">毕业后加入天猫</p>
              <p className="text-base font-body text-secondary-text leading-normal">2014.7 - 2015.7</p>
            </div>
            
            {/* 2011.7 - 2014.7 在电子科大研究云计算，获得硕士学位 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,72H32a8,8,0,0,0-8,8V176a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A8,8,0,0,0,224,72Zm-56,104H88a8,8,0,0,1,0-16h80a8,8,0,0,1,0,16Zm48-32H88a8,8,0,0,1,0-16h136a8,8,0,0,1,0,16Zm0-32H88a8,8,0,0,1,0-16h136a8,8,0,0,1,0,16Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">在电子科大研究云计算，获得硕士学位</p>
              <p className="text-base font-body text-secondary-text leading-normal">2011.7 - 2014.7</p>
            </div>
            
            {/* 2007.9 - 2011.6 在湘潭大学学习网络工程，获得学士学位 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,72H32a8,8,0,0,0-8,8V176a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A8,8,0,0,0,224,72Zm-56,104H88a8,8,0,0,1,0-16h80a8,8,0,0,1,0,16Zm48-32H88a8,8,0,0,1,0-16h136a8,8,0,0,1,0,16Zm0-32H88a8,8,0,0,1,0-16h136a8,8,0,0,1,0,16Z"></path>
              </svg>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">在湘潭大学学习网络工程，获得学士学位</p>
              <p className="text-base font-body text-secondary-text leading-normal">2007.9 - 2011.6</p>
            </div>
          </div>

          <h2 className="title-3 px-4 pb-3 pt-5">我目前感兴趣的领域</h2>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
            {/* 省略细节，结构保持一致 */}
            <div className="flex flex-col items-center gap-1 pt-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col pt-3 pb-5">
              <p className="text-base font-medium text-primary-text leading-normal">编程（Python，JavaScript，Go）</p>
            </div>
          </div>

          <h2 className="title-3 px-4 pb-3 pt-5">联系方式</h2>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-5">
              <p className="text-sm font-body text-secondary-text leading-normal">邮箱</p>
              <p className="text-sm font-ui text-primary-text leading-normal">mymonkey110@163.com</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-5">
              <p className="text-sm font-body text-secondary-text leading-normal">GitHub</p>
              <p className="text-sm font-ui text-primary-text leading-normal">github.com/mymonkey110</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-5">
              <p className="text-sm font-body text-secondary-text leading-normal">个人主页</p>
              <p className="text-sm font-ui text-primary-text leading-normal">michael-j.net</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

