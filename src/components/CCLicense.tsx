import React from 'react'

interface CCLicenseProps {
  articleUrl: string
}

const CCLicense: React.FC<CCLicenseProps> = ({ articleUrl }) => {
  return (
    <div 
      className="mt-16 pt-8 border-t border-border text-sm" 
      style={{ 
        fontFamily: 'Times New Roman, Georgia, serif',
        lineHeight: '1.8',
        color: '#333',
        borderLeft: '3px solid #e53e3e',
        backgroundColor: '#fafafa',
        padding: '1rem',
        borderRadius: '0 4px 4px 0'
      }}
    >
      <div className="mb-2">
        <span style={{ fontWeight: 'bold' }}>本文作者：</span>
        Michael Jiang
      </div>
      <div className="mb-2">
        <span style={{ fontWeight: 'bold' }}>本文链接：</span>
        <a href={articleUrl} className="text-primary hover:underline">
          {decodeURIComponent(articleUrl)}
        </a>
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}>版权声明：</span>
        本博客所有文章除特别声明外，均采用
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" 
           className="text-primary hover:underline ml-1 mr-1" 
           target="_blank" 
           rel="noopener noreferrer">
          CC BY-NC-SA 4.0
        </a>
        许可协议。转载请注明出处！
      </div>
    </div>
  )
}

export default CCLicense
