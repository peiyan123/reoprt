/**
 * Tips 组件类
 * 用于根据JSON数据渲染提示框
 */
class Tips {
    constructor(container) {
        this.container = container;
        this.tipsData = null;
    }

    /**
     * 渲染Tips内容
     * @param {Object} data - Tips数据
     * @param {string} data.title - 标题
     * @param {string} data.content - 内容文本 (HTML格式)
     */
    render(data) {
        if (!data || !this.container) return;

        const html = `
            <div class="next-recommend-container">
                <div class="tip-icon">
                    <img src="./assets/tip-header.png" alt="提示图标" onerror="this.style.display='none'">
                </div>
                <div class="recommend-content">
                    <div class="recommend-title">${data.title || '提示'}</div>
                    <div class="recommend-text">
                        ${data.content || ''}
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * 更新Tips数据 - 兼容旧版数据格式
     * @param {Object} data - Tips数据
     */
    updateTips(data) {
        if (!data) return;
        
        // 处理不同格式的数据
        const tipData = {
            title: data.title || '提示',
            content: data.content || data.conclusion || ''
        };
        
        // 如果有description和suggestions，添加到content中
        if (data.description || (data.suggestions && data.suggestions.length)) {
            let contentHtml = '';
            
            if (data.description) {
                contentHtml += `<p>${data.description}</p>`;
            }
            
            if (data.suggestions && data.suggestions.length) {
                contentHtml += '<ul>' + 
                    data.suggestions.map(item => `<li>${item}</li>`).join('') + 
                    '</ul>';
            }
            
            // 如果已有content，放在最后
            if (data.conclusion) {
                contentHtml += `<p>${data.conclusion}</p>`;
            }
            
            tipData.content = contentHtml;
        }
        
        this.render(tipData);
    }
}

// 导出全局类
window.Tips = Tips;
