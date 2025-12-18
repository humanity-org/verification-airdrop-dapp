/**
 * RainbowKit 主题预览组件
 * 
 * 用于在开发环境中预览和测试不同的主题预设
 */
import { useState } from 'react';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { getTheme, type ThemePreset } from '@/config/rainbowkit-theme';

export function ThemePreview() {
  const [preset, setPreset] = useState<ThemePreset>('default');

  return (
    <div className="min-h-screen bg-gray-1 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 主题选择器 */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            RainbowKit 主题预设
          </h2>
          <div className="flex gap-4">
            {(['default', 'compact', 'highContrast'] as ThemePreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all
                  ${preset === p 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-gray-3 text-gray-11 hover:bg-gray-4'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 主题预览区域 */}
        <RainbowKitProvider theme={getTheme(preset)}>
          <div className="glass rounded-xl p-8 space-y-6">
            <h3 className="text-xl font-semibold text-white">
              当前主题: {preset}
            </h3>
            
            {/* ConnectButton 预览 */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-11 mb-2">连接按钮：</p>
                <ConnectButton />
              </div>
              
              <div>
                <p className="text-sm text-gray-11 mb-2">账户按钮（连接后可见）：</p>
                <ConnectButton showBalance={true} />
              </div>
            </div>

            {/* 主题特性说明 */}
            <div className="border-t border-gray-6 pt-6 mt-6">
              <h4 className="text-lg font-medium text-white mb-3">主题特性</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-11">圆角：</p>
                  <p className="text-white font-medium">
                    {preset === 'compact' ? 'medium (8px)' : 'large (12px)'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-11">毛玻璃效果：</p>
                  <p className="text-white font-medium">
                    {preset === 'compact' ? 'small' : 'large'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-11">文字对比度：</p>
                  <p className="text-white font-medium">
                    {preset === 'highContrast' ? '增强 (0.8)' : '标准 (0.6)'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-11">适用场景：</p>
                  <p className="text-white font-medium">
                    {preset === 'default' ? '桌面端' : preset === 'compact' ? '移动端' : '可访问性'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>

        {/* 颜色系统展示 */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">颜色系统</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-green-500 rounded-lg" />
              <p className="text-xs text-gray-11">green-500 (主色)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-green-400 rounded-lg" />
              <p className="text-xs text-gray-11">green-400 (次要)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gray-3 rounded-lg border border-gray-6" />
              <p className="text-xs text-gray-11">背景色</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gray-12 rounded-lg" />
              <p className="text-xs text-gray-11">文字色</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
