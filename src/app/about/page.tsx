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
            <div className="flex flex-col items-center gap-1 pt-3">
              {/* DDD - 领域驱动设计 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-16,16v72H120V48Zm-88,0H64v72H48V48ZM48,208V136H64v72Zm88,0V136h80v72Zm48,0H184V168h32v40Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">DDD</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              {/* Vibe Coding - 氛围编码 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M237.66,90.34A104,104,0,0,0,24,128a103.08,103.08,0,0,0,17.72,58.61L96,128,41.72,79.39A103.08,103.08,0,0,0,24,128a104,104,0,0,0,213.66-37.66ZM48,128a80,80,0,0,1,158.18-16.13L160,128l46.18,16.13A80,80,0,0,1,48,128Zm64,64L72.81,148.07A88.34,88.34,0,0,0,112,192Zm0-128a88.34,88.34,0,0,0-39.19,11.93L112,64Zm64,96L176,128l16-5.71A87.55,87.55,0,0,0,176,160Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">Vibe Coding</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              {/* Software Architecture & Theory - 软件架构与理论 */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,168H40a16,16,0,0,1-16-16V48A16,16,0,0,1,40,32H216a16,16,0,0,1,16,16V152A16,16,0,0,1,216,168ZM40,48V152H216V48Zm0,0V48H216V48Zm176,112H40V152H216v8Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">Software Architecture & Theory</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              {/* Java & WEB */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM128,208a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,208Zm0-144a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64Zm40,96a8,8,0,0,1-8,8h-16v16a8,8,0,0,1-16,0V168H96a8,8,0,0,1,0-16h16V136a8,8,0,0,1,16,0v16h16A8,8,0,0,1,168,160Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">Java & WEB</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              {/* TypeScript */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,32H40A16,16,0,0,0,24,48V208a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V48A16,16,0,0,0,216,32ZM216,208H40V48H216V208ZM176,80h-8v48h16a24,24,0,0,1,0,48H152V176h16a8,8,0,0,0,0-16H152V80Zm-64,96H88v16H72a8,8,0,0,1,0-16H88V136H72a24,24,0,0,1,0-48H104V80H88a8,8,0,0,1,0-16h48a24,24,0,0,1,24,24v80A24,24,0,0,1,136,192H112Z"></path>
              </svg>
              <div className="w-[1.5px] bg-border h-2 grow"></div>
            </div>
            <div className="flex flex-1 flex-col py-3">
              <p className="text-base font-medium text-primary-text leading-normal">TypeScript</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-[1.5px] bg-border h-2"></div>
              {/* Rust */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M232,128a104,104,0,1,1-104-104A104.11,104.11,0,0,1,232,128Zm-96,88a87.86,87.86,0,0,0,48.86-14.91l-34-27.18-34,27.18A87.6,87.6,0,0,0,136,216Zm48.86-140.91A87.86,87.86,0,0,0,136,40a87.6,87.6,0,0,0-48.86,14.91l34,27.18,34-27.18ZM40,128a87.6,87.6,0,0,0,48.86,81.09l34-27.18-34-27.18A87.86,87.86,0,0,0,40,128Zm128,0a40,40,0,1,1,40-40A40.05,40.05,0,0,1,168,128Z"></path>
              </svg>
            </div>
            <div className="flex flex-1 flex-col py-3 pb-5">
              <p className="text-base font-medium text-primary-text leading-normal">Rust</p>
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

