'use client'
import Sidebar from '@/pages/admin/components/Sidebar'

export default function AdminDashboard() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden font-ui">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-primary-text tracking-light title-1 leading-tight min-w-72">仪表盘</p>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
                <p className="text-primary-text text-base font-medium leading-normal font-body">文章总数</p>
                <p className="text-primary-text tracking-light title-3 leading-tight">150</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
                <p className="text-primary-text text-base font-medium leading-normal font-body">评论总数</p>
                <p className="text-primary-text tracking-light title-3 leading-tight">620</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
                <p className="text-primary-text text-base font-medium leading-normal font-body">访问量</p>
                <p className="text-primary-text tracking-light title-3 leading-tight">15,875</p>
              </div>
            </div>
            <h2 className="text-primary-text title-3 leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">常用功能</h2>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <a href="/admin/articles/new">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-accent text-primary-text text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors font-ui">
                    <span className="truncate">发布新文章</span>
                  </button>
                </a>
                <a href="/admin/comments">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-surface text-primary-text text-sm font-bold leading-normal tracking-[0.015em] hover:bg-surface/80 transition-colors font-ui">
                    <span className="truncate">管理评论</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

