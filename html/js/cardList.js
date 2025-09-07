// cardList.js - 卡片列表组件

class CardList {
    constructor(container) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            console.error('CardList: 找不到容器元素');
            return;
        }
        
        // 常量配置
        this.CONFIG = {
            GAP_WIDTH: 16,          // 卡片间距
            MOBILE_BREAKPOINT: 768,  // 移动端断点
            MOBILE_CARDS_PER_ROW: 2, // 移动端每行卡片数
            PC_MAX_CARDS_PER_ROW: 5, // PC端每行最大卡片数
            PADDING_VALUE: 12        // 行容器内边距
        };
    }

    /**
     * 渲染卡片列表
     * @param {Object} config - 配置对象
     */
    render(config) {
        if (!config?.item?.length) {
            console.error('CardList: 无效的配置数据');
            return;
        }

        this.container.innerHTML = '';
        const isMobile = window.innerWidth < this.CONFIG.MOBILE_BREAKPOINT;
        isMobile ? this._renderMobile(config.item) : this._renderDesktop(config.item);
    }
    
    /**
     * 计算卡片宽度并设置CSS变量
     * @param {Array<Array>} rows - 分组后的卡片行
     * @param {String} cssVarPrefix - CSS变量前缀
     */
    _setCardWidthVariables(rows, cssVarPrefix) {
        rows.forEach((rowItems, rowIndex) => {
            const itemsCount = rowItems.length;
            const cardWidthPercent = 100 / itemsCount;
            const gapWidthPerCard = (itemsCount - 1) * this.CONFIG.GAP_WIDTH / itemsCount;
            document.documentElement.style.setProperty(
                `--${cssVarPrefix}-width-row-${rowIndex}`, 
                `calc(${cardWidthPercent}% - ${gapWidthPerCard}px)`
            );
        });
    }
    
    /**
     * 计算行容器宽度
     * @param {Number} itemsInRow - 行中的卡片数量
     * @param {Number} maxItemsInRow - 最大的行卡片数量
     * @param {Boolean} isMobile - 是否为移动端
     */
    _calculateRowWidth(itemsInRow, maxItemsInRow, isMobile = false) {
        const rowWidthPercent = (itemsInRow / maxItemsInRow) * 100;
        
        if (isMobile) {
            const paddingToSubtract = Math.round(this.CONFIG.PADDING_VALUE * 2 * rowWidthPercent / 100);
            return { widthValue: `calc(${rowWidthPercent}% - ${paddingToSubtract}px)`, widthPercent: rowWidthPercent };
        }
        
        return { widthValue: `${rowWidthPercent}%`, widthPercent: rowWidthPercent };
    }

    /**
     * 处理移动端文本溢出
     * @param {HTMLElement} card - 卡片元素
     * @param {Boolean} isLastRow - 是否为最后一行
     */
    _handleMobileCardTextOverflow(card, isLastRow = false) {
        // 标题多行溢出
        const title = card.querySelector('.card-title');
        if (title) {
            Object.assign(title.style, {
                whiteSpace: 'normal', overflow: 'hidden', display: '-webkit-box',
                webkitLineClamp: '2', webkitBoxOrient: 'vertical',
                lineHeight: '1.3', maxHeight: '32px'
            });
        }
        
        // 单行文本溢出
        card.querySelectorAll('.card-count, .card-left-label, .card-left-value, .card-right-info')
            .forEach(el => Object.assign(el.style, {
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }));
        
        // 信息行处理
        const infoRow = card.querySelector('.card-info-row');
        if (infoRow) {
            Object.assign(infoRow.style, {display: 'flex', flexWrap: 'nowrap', minWidth: '0', overflow: 'hidden'});
            if (isLastRow) infoRow.classList.add('mobile-last-row-info');
        }
        
        // 底部行处理
        const bottomRow = card.querySelector('.card-bottom-row');
        if (bottomRow) {
            Object.assign(bottomRow.style, {display: 'flex', flexWrap: 'nowrap', minWidth: '0', overflow: 'hidden'});
            if (isLastRow) bottomRow.classList.add('mobile-last-row-info');
        }
        
        // 底部标签和差异值处理
        card.querySelectorAll('.card-bottom-label, .card-difference-value')
            .forEach(el => Object.assign(el.style, {
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }));
    }
    
    /**
     * 移动端渲染逻辑
     * @param {Array} items - 卡片数据数组
     */
    _renderMobile(items) {
        // 创建容器及分配卡片到行
        const gridContainer = document.createElement('div');
        gridContainer.className = 'card-grid-container mobile-grid';
        const cardsPerRow = this.CONFIG.MOBILE_CARDS_PER_ROW;
        
        // 划分行并设置CSS变量
        const cardRows = [];
        for (let i = 0; i < items.length; i += cardsPerRow) 
            cardRows.push(items.slice(i, i + cardsPerRow));
        
        this._setCardWidthVariables(cardRows, 'mobile-card');
        
        // 渲染行和卡片
        cardRows.forEach((rowItems, rowIndex) => {
            const isLastRow = rowIndex === cardRows.length - 1;
            const hasOnlyOneCard = rowItems.length === 1;
            
            // 检查行中是否有卡片包含rightLabel
            const hasRightLabel = rowItems.some(cardData => cardData.rightLabel && cardData.rightLabel.trim() !== '');
            
            // 创建行容器
            const rowContainer = this._createRowContainer(rowItems.length, cardsPerRow, rowIndex, true, hasOnlyOneCard, hasRightLabel);
            rowContainer.className = 'mobile-card-row';
            
            // 如果有rightLabel，添加特殊类名
            if (hasRightLabel) {
                rowContainer.classList.add('has-right-label');
            }
            
            // 添加卡片
            rowItems.forEach(cardData => {
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-grid-item';
                cardContainer.style.flex = `0 0 var(--mobile-card-width-row-${rowIndex})`;
                if (isLastRow && hasOnlyOneCard) cardContainer.classList.add('mobile-last-single');
                
                // 检查是否是"无leftLabel但有dataSource"的情况
                if ((!cardData.leftLabel || cardData.leftLabel.trim() === '') && 
                    cardData.dataSource && cardData.dataSource.length > 0) {
                    cardContainer.classList.add('has-datasource-no-leftlabel');
                }
                
                // 检查是否有bottomLabel
                if (cardData.bottomLabel && cardData.bottomLabel.trim() !== '') {
                    cardContainer.classList.add('has-bottom-label');
                }
                
                // 卡片创建与样式处理
                const card = this._createCard(cardData);
                card.classList.add('mobile-card');
                this._handleMobileCardTextOverflow(card, isLastRow);
                
                // 最后一行单卡片特殊处理
                if (isLastRow && hasOnlyOneCard) {
                    const infoRow = card.querySelector('.card-info-row');
                    if (infoRow) infoRow.style.fontSize = '11px';
                }
                
                cardContainer.appendChild(card);
                rowContainer.appendChild(cardContainer);
            });
            
            gridContainer.appendChild(rowContainer);
        });
        
        this.container.appendChild(gridContainer);
        this._ensureMobileRowStyles(gridContainer);
    }
    
    /**
     * 创建行容器
     * @param {Number} itemsCount - 行内卡片数量 
     * @param {Number} maxItemsPerRow - 最大行卡片数量
     * @param {Number} rowIndex - 行索引
     * @param {Boolean} isMobile - 是否为移动端
     * @param {Boolean} hasOnlyOneCard - 是否只有一张卡片
     * @param {Boolean} hasRightLabel - 是否有rightLabel
     * @returns {HTMLElement} 行容器元素
     */
    _createRowContainer(itemsCount, maxItemsPerRow, rowIndex, isMobile = false, hasOnlyOneCard = false, hasRightLabel = false) {
        const rowContainer = document.createElement('div');
        let widthValue;
        
        // 如果是移动端且有rightLabel，设置为calc(100% - 12px)
        if (isMobile && hasRightLabel) {
            widthValue = 'calc(100% - 12px)';
        } else {
            // 其他情况使用标准计算
            const widthResult = this._calculateRowWidth(itemsCount, maxItemsPerRow, isMobile);
            widthValue = widthResult.widthValue;
        }
        
        // 设置基本属性
        rowContainer.style.width = widthValue;
        rowContainer.style.setProperty('--calculated-width', widthValue);
        rowContainer.dataset.rowIndex = rowIndex;
        rowContainer.dataset.itemCount = itemsCount;
        rowContainer.dataset.calculatedWidth = widthValue;
        rowContainer.dataset.hasRightLabel = hasRightLabel ? 'true' : 'false';
        
        // 单卡片特殊处理
        if (hasOnlyOneCard) {
            rowContainer.style.justifyContent = 'flex-start';
            rowContainer.style.marginLeft = '0';
        }
        
        return rowContainer;
    }

    /**
     * 确保移动端行样式正确应用
     * @param {HTMLElement} gridContainer - 网格容器
     */
    _ensureMobileRowStyles(gridContainer) {
        setTimeout(() => {
            gridContainer.querySelectorAll('.mobile-card-row').forEach(row => {
                // 检查是否有rightLabel
                const hasRightLabel = row.dataset.hasRightLabel === 'true';
                
                // 根据是否有rightLabel设置宽度
                if (hasRightLabel) {
                    row.style.width = 'calc(100% - 12px)';
                    row.style.setProperty('--calculated-width', 'calc(100% - 12px)');
                } else {
                    row.style.width = row.dataset.calculatedWidth;
                    row.style.setProperty('--calculated-width', row.dataset.calculatedWidth);
                }
                
                // 单卡片特殊处理
                if (row.dataset.itemCount === '1') {
                    row.style.justifyContent = 'flex-start';
                    row.style.marginLeft = '0';
                }
            });
        }, 0);
    }

    /**
     * 分配卡片到行
     * @param {Array} items - 卡片数据
     * @returns {Array<Array>} 分组后的卡片行
     */
    _distributeItemsToRows(items) {
        const totalItems = items.length;
        const maxCardsPerRow = this.CONFIG.PC_MAX_CARDS_PER_ROW;
        
        if (totalItems <= maxCardsPerRow) return [items];
        
        // 特殊情况处理 - 对特定数量进行优化布局
        const specialCases = {
            6: [[0,3], [3,6]], 7: [[0,4], [4,7]], 8: [[0,4], [4,8]], 
            9: [[0,5], [5,9]], 10: [[0,5], [5,10]]
        };
        
        if (specialCases[totalItems]) 
            return specialCases[totalItems].map(([start, end]) => items.slice(start, end));
        
        // 常规情况：均匀分配
        const rows = [];
        for (let i = 0; i < totalItems; i += maxCardsPerRow)
            rows.push(items.slice(i, i + maxCardsPerRow));
        return rows;
    }

    /**
     * 桌面端渲染逻辑
     * @param {Array} items - 卡片数据数组
     */
    _renderDesktop(items) {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'card-grid-container';
        
        // 分配卡片到行并设置CSS变量
        const cardRows = this._distributeItemsToRows(items);
        if (cardRows.length > 1) gridContainer.classList.add('multi-row');
        
        const maxItemsInRow = Math.max(...cardRows.map(row => row.length));
        this._setCardWidthVariables(cardRows, 'card');
        
        // 渲染行和卡片
        cardRows.forEach((rowItems, rowIndex) => {
            const rowContainer = this._createRowContainer(rowItems.length, maxItemsInRow, rowIndex);
            rowContainer.className = 'card-grid-row-container';
            
            // 添加卡片到行容器
            rowItems.forEach(cardData => {
                const cardContainer = document.createElement('div');
                cardContainer.className = 'card-grid-item';
                cardContainer.style.flex = `0 0 var(--card-width-row-${rowIndex})`;
                
                // 检查是否是"无leftLabel但有dataSource"的情况
                if ((!cardData.leftLabel || cardData.leftLabel.trim() === '') && 
                    cardData.dataSource && cardData.dataSource.length > 0) {
                    cardContainer.classList.add('has-datasource-no-leftlabel');
                }
                
                // 检查是否有bottomLabel
                if (cardData.bottomLabel && cardData.bottomLabel.trim() !== '') {
                    cardContainer.classList.add('has-bottom-label');
                }
                
                const card = this._createCard(cardData);
                card.classList.add('pc-card');
                
                cardContainer.appendChild(card);
                rowContainer.appendChild(cardContainer);
            });
            
            gridContainer.appendChild(rowContainer);
        });
        
        this.container.appendChild(gridContainer);
    }
    
    /**
     * 创建单个卡片
     * @param {Object} cardData - 卡片数据
     * @returns {HTMLElement} - 卡片元素
     */
    _createCard(cardData) {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.style.position = 'relative'; // 确保卡片元素使用相对定位，这样绝对定位的详情标签才能正确显示
        
        // 使用模板字符串高效创建基础结构
        let leftValueHtml = '';
        if (cardData.leftValue !== undefined) {
            const numValue = parseFloat(cardData.leftValue);
            if (numValue > 0) {
                leftValueHtml = `<span class="card-left-value card-value-up">增加${Math.abs(numValue)}<svg viewBox="64 64 896 896" data-icon="arrow-up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z" fill="#00A857"></path></svg></span>`;
            } else if (numValue < 0) {
                leftValueHtml = `<span class="card-left-value card-value-down">减少${Math.abs(numValue)}<svg viewBox="64 64 896 896" data-icon="arrow-down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8-6 13.2l332.8 382c4.8 5.5 11.9 8.6 19.2 8.6s14.4-3.1 19.2-8.6l332.8-382a7.95 7.95 0 00-6-13.2z" fill="#D35A21"></path></svg></span>`;
            } else {
                leftValueHtml = '<span class="card-left-value card-value-neutral">持平 -</span>';
            }
        }
        
        // 处理rightValue的显示方式，与leftValue保持一致
        let rightValueHtml = '';
        if (cardData.rightValue !== undefined) {
            const numValue = parseFloat(cardData.rightValue);
            if (numValue > 0) {
                rightValueHtml = `<span class="card-right-value card-value-up" >增加${Math.abs(numValue)}<svg viewBox="64 64 896 896" data-icon="arrow-up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z" fill="#00A857"></path></svg></span>`;
            } else if (numValue < 0) {
                rightValueHtml = `<span class="card-right-value card-value-down" >减少${Math.abs(numValue)}<svg viewBox="64 64 896 896" data-icon="arrow-down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8-6 13.2l332.8 382c4.8 5.5 11.9 8.6 19.2 8.6s14.4-3.1 19.2-8.6l332.8-382a7.95 7.95 0 00-6-13.2z" fill="#D35A21"></path></svg></span>`;
            } else {
                rightValueHtml = '<span class="card-right-value card-value-neutral" >持平 -</span>';
            }
        }
        
        // 处理differenceValue显示，不包含箭头，使用括号括住
        let differenceValueHtml = '';
        if (cardData.differenceValue !== undefined) {
            // 提取数值部分和单位部分
            const valueMatch = String(cardData.differenceValue).match(/([-+]?\d*\.?\d+)(.*)$/);
            
            if (valueMatch) {
                const numValue = parseFloat(valueMatch[1]);
                const unit = valueMatch[2] || ''; // 获取单位，如"%"、"元"等
                
                if (numValue > 0) {
                    differenceValueHtml = `<span class="card-difference-value card-value-up" style="margin-left: 10px;">(增加${Math.abs(numValue)}${unit})</span>`;
                } else if (numValue < 0) {
                    differenceValueHtml = `<span class="card-difference-value card-value-down" style="margin-left: 10px;">(减少${Math.abs(numValue)}${unit})</span>`;
                } else {
                    differenceValueHtml = '<span class="card-difference-value card-value-neutral" style="margin-left: 10px;">(持平)</span>';
                }
            } else {
                // 如果无法解析为数值，则原样显示
                differenceValueHtml = `<span class="card-difference-value card-value-neutral" style="margin-left: 10px;">(${cardData.differenceValue})</span>`;
            }
        }
        
        // 创建进度条HTML
        let progressHtml = '';
        let bottomRowHtml = '';
        if (cardData.bottomLabel) {
            const progressValue = cardData.progress || '0';
            
            // 进度条HTML
            progressHtml = `
                <div class="card-progress-container" style="margin-top: 8px; width: 100%; height: 4px; background-color: #f0f0f0; border-radius: 2px;">
                    <div class="card-progress-bar" style="width: ${progressValue}%; height: 100%; background-color: #00A857; border-radius: 2px;"></div>
                </div>
            `;
            
            // 底部标签行HTML
            bottomRowHtml = `
                <div class="card-bottom-row" style="margin-top: 4px; display: flex; justify-content: space-between; font-size: 12px; color: #808080;">
                    <div class="card-bottom-label" style="display: flex; align-items: center;">
                        <span>${cardData.bottomLabel}：${cardData.bottomValue || ''}</span>
                        ${differenceValueHtml}
                    </div>
                </div>
            `;
        }
        
        // 创建rightLabel样式
        const rightLabelStyle = 'font-size:12px; font-weight:normal; line-height:18px; color:#808080;';
        
        // 根据是否有leftLabel决定布局
        if (!cardData.leftLabel) {
            // 当leftLabel不存在或为空时，去掉第三行，在第二行右侧显示rightLabel和rightValue，并在左侧加分割线
            card.innerHTML = `
                <div class="card-title">${cardData.title || ''}</div>
                <div class="card-count">${cardData.count || '0'}${(cardData.rightLabel && cardData.rightValue) ? 
                    `<div style="float:right; border-left:1px solid #dcdcdc; padding-left:8px; margin-left:8px; display: flex; font-size: 12px;align-items: center;gap: 5px"><div style="${rightLabelStyle}">${cardData.rightLabel}</div>:${rightValueHtml}</div>` : 
                    ''}
                </div>
                ${progressHtml}
                ${bottomRowHtml}
            `;
        } else {
            // 有leftLabel时，保持原样式
            card.innerHTML = `
                <div class="card-title">${cardData.title || ''}</div>
                <div class="card-count">${cardData.count || '0'}</div>
                <div class="card-info-row">
                    <div class="card-left-info">
                        <span class="card-left-label">${cardData.leftLabel}</span>
                        ${leftValueHtml}
                    </div>
                    ${(cardData.rightLabel && cardData.rightValue) ? 
                        `<div class="card-right-info" style="display:flex; align-items:center;"><span style="${rightLabelStyle}">${cardData.rightLabel}</span>${rightValueHtml}</div>` : 
                        ''}
                </div>
                ${progressHtml}
                ${bottomRowHtml}
            `;
        }
        
        // 添加详情标识（如果dataSource长度超过5），在创建卡片内容之后添加
        if (cardData.dataSource && cardData.dataSource.length > 5) {
            const detailTag = document.createElement('div');
            detailTag.className = 'card-detail-tag';
            detailTag.innerHTML = `详情<svg viewBox="64 64 896 896" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg>`;
            detailTag.style.position = 'absolute';
            detailTag.style.top = '-4px';
            detailTag.style.right = '0px';
            detailTag.style.color = '#006F3F';
            detailTag.style.fontSize = '12px';
            detailTag.style.display = 'flex';
            detailTag.style.alignItems = 'center';
            detailTag.style.borderRadius = '2px';
            detailTag.style.padding = '2px 4px';
            detailTag.style.zIndex = '2';
            detailTag.style.cursor = 'pointer';
            card.appendChild(detailTag);
        }
        
        return card;
    }
    
}

// 注册到全局
window.CardList = CardList;
