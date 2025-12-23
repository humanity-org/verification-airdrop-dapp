/**
 * RainbowKit theme preview component
 * 
 * Used to preview and test different theme presets in development environment
 */
import { useState } from 'react';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { getTheme, type ThemePreset } from '@/config/rainbowkit-theme';

export function ThemePreview() {
  const [preset, setPreset] = useState<ThemePreset>('default');

  return (
    <div className="min-h-screen bg-gray-1 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Theme selector */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            RainbowKit Theme Presets
          </h2>
          <div className="flex gap-4">
            {(['default', 'compact', 'highContrast'] as ThemePreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all cursor-pointer
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

        {/* Theme preview area */}
        <RainbowKitProvider theme={getTheme(preset)}>
          <div className="glass rounded-xl p-8 space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Current Theme: {preset}
            </h3>
            
            {/* ConnectButton preview */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-11 mb-2">Connect Button:</p>
                <ConnectButton />
              </div>
              
              <div>
                <p className="text-sm text-gray-11 mb-2">Account Button (visible after connection):</p>
                <ConnectButton showBalance={true} />
              </div>
            </div>

            {/* Theme features description */}
            <div className="border-t border-gray-6 pt-6 mt-6">
              <h4 className="text-lg font-medium text-white mb-3">Theme Features</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-11">Border Radius:</p>
                  <p className="text-white font-medium">
                    {preset === 'compact' ? 'medium (8px)' : 'large (12px)'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-11">Glass Effect:</p>
                  <p className="text-white font-medium">
                    {preset === 'compact' ? 'small' : 'large'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-11">Text Contrast:</p>
                  <p className="text-white font-medium">
                    {preset === 'highContrast' ? 'Enhanced (0.8)' : 'Standard (0.6)'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-11">Use Case:</p>
                  <p className="text-white font-medium">
                    {preset === 'default' ? 'Desktop' : preset === 'compact' ? 'Mobile' : 'Accessibility'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>

        {/* Color system display */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Color System</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-green-500 rounded-lg" />
              <p className="text-xs text-gray-11">green-500 (primary)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-green-400 rounded-lg" />
              <p className="text-xs text-gray-11">green-400 (secondary)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gray-3 rounded-lg border border-gray-6" />
              <p className="text-xs text-gray-11">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gray-12 rounded-lg" />
              <p className="text-xs text-gray-11">Text</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
