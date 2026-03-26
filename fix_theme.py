import re

def main():
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    new_root = """:root {
    /* Premium Warm Light Theme Colors */
    --bg-base: #faf7f2;
    --bg-primary: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.85);
    --bg-input: #ffffff;
    --bg-secondary: #f0ebe1;
    --bg-panel: rgba(255, 255, 255, 0.7);
    --bg-panel-hover: rgba(255, 255, 255, 0.9);
    --bg-header: rgba(250, 247, 242, 0.85);
    
    --text-primary: #3a2e26;
    --text-secondary: #6e5e54;
    --text-muted: #a4978e;
    
    --accent-primary: #d9a05b; /* Warm Amber */
    --accent-primary-glow: rgba(217, 160, 91, 0.2);
    --accent-secondary: #8b5cf6;
    
    --accent-cyan: #d9a05b; 
    --accent-purple: #8b5cf6;
    --accent-pink: #e69a8d; 
    --accent-green: #10b981;
    --accent-orange: #f59e0b;
    
    --border-subtle: #ebdcd0;
    --border-accent: #d9a05b;
    --border-color: rgba(0, 0, 0, 0.08);
    --border-highlight: rgba(217, 160, 91, 0.5);
    
    --gradient-main: linear-gradient(135deg, #d9a05b, #c27d38);
    
    /* Layout & Effects */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    --radius-full: 9999px;
    
    --shadow-subtle: 0 4px 20px rgba(0, 0, 0, 0.03);
    --shadow-glow: 0 0 20px rgba(217, 160, 91, 0.15);
    
    --transition-fast: 0.15s ease;
    --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Typography */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;"""

    css = re.sub(r':root\s*\{.*?(?=\})', new_root, css, flags=re.DOTALL)

    # Replace dark backgrounds with light text colors used in dark mode
    css = css.replace('rgba(10, 11, 15, 0.85)', 'rgba(255, 255, 255, 0.85)')
    css = css.replace('rgba(10, 11, 15, 0.5)', 'rgba(255, 255, 255, 0.5)')
    css = css.replace('rgba(10, 11, 15, 0.9)', 'rgba(250, 247, 242, 0.95)')
    css = css.replace('rgba(10, 11, 15, 0.95)', 'rgba(250, 247, 242, 0.95)')
    css = css.replace('rgba(18, 19, 26, 0.8)', 'rgba(255, 255, 255, 0.8)')
    
    # White with low opacity on dark background -> black with low opacity on light background
    css = css.replace('rgba(255, 255, 255, 0.03)', 'rgba(0, 0, 0, 0.03)')
    css = css.replace('rgba(255, 255, 255, 0.02)', 'rgba(0, 0, 0, 0.02)')
    css = css.replace('rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.05)')
    css = css.replace('rgba(255, 255, 255, 0.015)', 'rgba(0, 0, 0, 0.015)')
    
    # Cyan rgba -> Amber rgba
    css = css.replace('rgba(0, 240, 255, 0.2)', 'rgba(217, 160, 91, 0.2)')
    css = css.replace('rgba(0, 240, 255, 0.3)', 'rgba(217, 160, 91, 0.3)')
    css = css.replace('rgba(0, 240, 255, 0.5)', 'rgba(217, 160, 91, 0.5)')
    css = css.replace('rgba(0, 240, 255, 0.06)', 'rgba(217, 160, 91, 0.06)')
    css = css.replace('rgba(0, 240, 255, 0.12)', 'rgba(217, 160, 91, 0.12)')
    css = css.replace('rgba(0, 240, 255, 0.04)', 'rgba(217, 160, 91, 0.04)')
    css = css.replace('rgba(0, 240, 255, 0.08)', 'rgba(217, 160, 91, 0.08)')
    css = css.replace('rgba(0, 240, 255, 0.15)', 'rgba(217, 160, 91, 0.15)')
    css = css.replace('rgba(0, 240, 255, 0.03)', 'rgba(217, 160, 91, 0.03)')

    # Purple rgba -> New purple rgba
    css = css.replace('rgba(123, 97, 255, 0.15)', 'rgba(139, 92, 246, 0.15)')
    css = css.replace('rgba(123, 97, 255, 0.3)', 'rgba(139, 92, 246, 0.3)')
    css = css.replace('rgba(123, 97, 255, 0.06)', 'rgba(139, 92, 246, 0.06)')
    css = css.replace('rgba(123, 97, 255, 0.1)', 'rgba(139, 92, 246, 0.1)')
    
    # Hex value replacements
    css = css.replace('#00F0FF', '#d9a05b')
    css = css.replace('#7B61FF', '#8b5cf6')
    css = css.replace('#FF6B9D', '#e69a8d')

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('#00F0FF', '#d9a05b')
    html = html.replace('#7B61FF', '#8b5cf6')
    html = html.replace('#FF6B6B', '#e69a8d')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    main()
