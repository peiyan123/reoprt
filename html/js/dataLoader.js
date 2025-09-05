// dataLoader.js - 直接提供 JSON 数据

// 加载数据
async function loadReportData() {
    // 直接返回内嵌的 JSON 数据
    return [
      {
        "title":"投资企业月报",
        "time": "2025年1月12日",
        "name":"中科创达",
        "tabList": [
          {
            "name": "运行分析",
            "titleList": [
              {
                "title": "1、综合分析",
                "type": "h1",
                "titleList": [
                  {
                    "title": "1.1、项目概述",
                    "type": "h2"
                  },
                  {
                    "type": "text",
                    "content": "这里是文本内容，文本内容需直接返回css样式支持的html格式字符串"
                  },
                  {
                    "type": "tips",
                    "name": "改善建议",
                    "content": "这里是正文内容，文本内容需直接返回css样式支持的html格式字符串"
                  },
                  {
                    "type": "chartBar",
                    "title": "车辆使用年限分布",
                    "dataSource": [
                        { "name": '3-5年', "value": 75 },
                        { "name": '3年内', "value": 36 },
                        { "name": '5-8年', "value": 31 },
                        { "name": '8年以上', "value": 19 }
                    ]
                  },
                  {
                    "type": "chartRing",
                    "title": "环卫器具模块分布图",
                    "total": { "num" : 2350, "unit": '万个' },
                    "changeInfo": { "num":6565, "unit": '个', "add":false },
                    "dataSource": [
                        { "value": 70.5, "name": '垃圾箱数量（万个）', "itemStyle": { "color": '#FFCF5F' } },
                        { "value": 70.5, "name": '人力车数量（万个）', "itemStyle": { "color": '#2276FC' } },
                        { "value": 55, "name": '其他器具数量（万个）', "itemStyle": { "color": '#52C066' } },
                        { "value": 55, "name": '其他器具数量（万个）', "itemStyle": { "color": '#52C066' } },
                        { "value": 55, "name": '其他器具数量（万个）', "itemStyle": { "color": '#52C066' } },
                        { "value": 25, "name": '垃圾桶数量（万个）', "itemStyle": { "color": '#F99C58' } }
                    ]
                  },
                  {
                    "type": "table",
                    "columns": [
                      { "title": "接口名称", "dataIndex": "name", "key": "name" },
                      { "title": "请求方式", "dataIndex": "method", "key": "method" },
                      { "title": "请求URL", "dataIndex": "url", "key": "url" }
                    ],
                    "dataSource": [
                      { "name": "获取用户信息", "method": "GET", "url": "/api/user/info"},
                      { "name": "更新用户信息", "method": "POST", "url": "/api/user/update"}
                    ]
                  },
                  {
                    "type": "cardList",
                    "item": [
                      {
                        "title": "本月应检车辆数（台）",
                        "count": "12",
                        "leftLabel": "较上月",
                        "leftValue": "+8",
                      },
                      {
                        "title": "本月应检车辆数（台）",
                        "count": "12",
                        "leftLabel": "较上月",
                        "leftValue": "-8",
                      },
                      {
                        "title": "本月应检车辆数（台）",
                        "count": "12",
                        "leftLabel": "较上月",
                        "leftValue": "0",
                      },
                      {
                        "title": "本月应检车辆数（台）",
                        "count": "12",
                        "leftLabel": "较上月",
                        "leftValue": "+8",
                      }
                    ],
                  },
                  {
                    "title": "1.2、项目概述",
                    "type": "h2"
                  },
                  {
                    "title": "1.2.1、项目概述",
                    "type": "h3"
                  }
                ]
              },
              {
                "title": "2、综合分析",
                "type": "h1",
                "titleList": [
                  {
                    "title": "2.1、项目概述",
                    "type": "h2",   
                  },
                  {
                    "type": "text",
                    "content": "这里是文本内容，文本内容需直接返回css样式支持的html格式字符串"
                  },
                  {
                    "type": "tips",
                    "name": "改善建议",
                    "content": "这里是正文内容，文本内容需直接返回css样式支持的html格式字符串"
                  },
                  {
                    "type": "table",
                    "columns": [
                      { "title": "接口名称", "dataIndex": "name", "key": "name" },
                      { "title": "请求方式", "dataIndex": "method", "key": "method" },
                      { "title": "请求URL", "dataIndex": "url", "key": "url" }
                    ],
                    "dataSource": [
                      { "key": "1", "name": "获取用户信息", "method": "GET", "url": "/api/user/info"},
                      { "key": "2", "name": "更新用户信息", "method": "POST", "url": "/api/user/update"}
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "情况概述"
          }
        ]
      }
    ];
}

// 更新报告标题和信息
function updateReportHeader(data) {
    if (!data || data.length === 0) return;
    
    const reportData = data[0];
    
    // 更新桌面端标题
    const reportTitle = document.querySelector('.report-title');
    if (reportTitle) {
        // 标题中包含当前选中的标签页名称
        const currentTabName = document.getElementById('current-tab-name');
        if (currentTabName) {
            currentTabName.textContent = reportData.tabList && reportData.tabList.length > 0 ? 
                reportData.tabList[0].name : '首页';
        }
        
        const titleText = document.createTextNode(reportData.title + ' - ');
        reportTitle.innerHTML = ''; // 清空现有内容
        reportTitle.appendChild(titleText);
        reportTitle.appendChild(currentTabName);
    }
    
    // 更新移动端主标题
    const mobileReportTitle = document.querySelector('.mobile-report-title');
    if (mobileReportTitle) {
        // 移动端不拼接tab名，只显示报告标题
        mobileReportTitle.textContent = reportData.title;
        
        // 更新移动端Tab标题
        const mobileTabTitle = document.querySelector('.mobile-tab-title');
        if (mobileTabTitle) {
            const tabName = reportData.tabList && reportData.tabList.length > 0 ? 
                reportData.tabList[0].name : '首页';
            mobileTabTitle.textContent = tabName;
        }
    }
    
    // 更新公司名和时间
    const companyElements = document.querySelectorAll('.company-name');
    companyElements.forEach(element => {
        element.textContent = reportData.name;
    });
    
    const dateElements = document.querySelectorAll('.generate-date');
    dateElements.forEach(element => {
        if (element.closest('.mobile-report-info')) {
            // 移动端只显示日期，不显示"生成日期"文字
            element.textContent = reportData.time;
        } else {
            // PC端显示"生成日期"文字
            element.textContent = `生成日期：${reportData.time}`;
        }
    });
    
    // 更新页面标题
    document.title = reportData.title;
}

// 生成标签页
function generateTabs(data) {
    if (!data || data.length === 0 || !data[0].tabList) return;
    
    const tabList = data[0].tabList;
    const tabsContainer = document.querySelector('.ant-tabs-nav-list');
    const mobileTabsContainer = document.querySelector('.mobile-buttons');
    const tabContentHolder = document.querySelector('.ant-tabs-content');
    const reportContentContainer = document.getElementById('report-content-container');
    
    if (!tabsContainer || !mobileTabsContainer || !tabContentHolder || !reportContentContainer) return;
    
    // 清除现有标签页
    tabsContainer.innerHTML = '';
    mobileTabsContainer.innerHTML = '';
    tabContentHolder.innerHTML = '';
    reportContentContainer.innerHTML = '';
    
    // 添加标签页
    tabList.forEach((tab, index) => {
        const key = `tab-${index}`;
        const isActive = index === 0;
        
        // 桌面端标签页
        const tabElement = document.createElement('div');
        tabElement.className = `ant-tabs-tab ${isActive ? 'ant-tabs-tab-active' : ''}`;
        tabElement.setAttribute('data-tab', key);
        tabElement.innerHTML = `<div role="tab" aria-selected="${isActive}" class="ant-tabs-tab-btn" tabindex="0">${tab.name}</div>`;
        tabsContainer.appendChild(tabElement);
        
        // 移动端按钮
        const mobileBtn = document.createElement('button');
        mobileBtn.className = `ant-btn ${isActive ? 'ant-btn-primary mobile-tab-btn active' : 'mobile-tab-btn'}`;
        mobileBtn.setAttribute('data-tab', key);
        mobileBtn.textContent = tab.name;
        mobileTabsContainer.appendChild(mobileBtn);
        
        // 标签内容区域
        const contentElement = document.createElement('div');
        contentElement.role = 'tabpanel';
        contentElement.tabIndex = isActive ? 0 : -1;
        contentElement.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        contentElement.className = `ant-tabs-tabpane ${isActive ? 'ant-tabs-tabpane-active' : ''}`;
        contentElement.id = `tab-content-${key}`;
        contentElement.style.display = isActive ? 'block' : 'none';
        contentElement.setAttribute('data-tab-content', key);
        
        tabContentHolder.appendChild(contentElement);
        
        // 为每个标签页创建内容容器
        const tabContentContainer = document.createElement('div');
        tabContentContainer.id = `tab-content-container-${key}`;
        tabContentContainer.className = `tab-content ${isActive ? 'active' : ''}`;
        tabContentContainer.style.display = isActive ? 'block' : 'none';
        reportContentContainer.appendChild(tabContentContainer);
    });
    
    // 添加墨水条
    const inkBar = document.createElement('div');
    inkBar.className = 'ant-tabs-ink-bar ant-tabs-ink-bar-animated';
    tabsContainer.appendChild(inkBar);
    
    // 绑定标签页点击事件
    bindTabEvents();
    
    // 设置默认墨水条位置
    setTimeout(() => {
        const activeTab = document.querySelector('.ant-tabs-tab-active');
        if (activeTab && inkBar) {
            const tabRect = activeTab.getBoundingClientRect();
            const navListRect = activeTab.parentElement.getBoundingClientRect();
            
            inkBar.style.width = `${tabRect.width}px`;
            inkBar.style.left = `${tabRect.left - navListRect.left}px`;
            inkBar.style.display = 'block';
        }
    }, 0);
}

// 绑定标签页点击事件
function bindTabEvents() {
    // 桌面端标签页
    const tabs = document.querySelectorAll('.ant-tabs-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabKey = this.getAttribute('data-tab');
            switchTab(tabKey);
        });
    });
    
    // 移动端标签页
    const mobileTabs = document.querySelectorAll('.mobile-tab-btn');
    mobileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabKey = this.getAttribute('data-tab');
            switchTab(tabKey);
        });
    });
}

// 切换标签页
function switchTab(tabKey) {
    // 更新标签页活动状态
    let activeTabElement = null;
    document.querySelectorAll('.ant-tabs-tab').forEach(tab => {
        tab.classList.remove('ant-tabs-tab-active');
        if (tab.getAttribute('data-tab') === tabKey) {
            tab.classList.add('ant-tabs-tab-active');
            activeTabElement = tab;
        }
    });
    
    // 更新墨水条位置
    if (activeTabElement) {
        const inkBar = document.querySelector('.ant-tabs-ink-bar');
        if (inkBar) {
            const tabRect = activeTabElement.getBoundingClientRect();
            const navListRect = activeTabElement.parentElement.getBoundingClientRect();
            
            inkBar.style.width = `${tabRect.width}px`;
            inkBar.style.left = `${tabRect.left - navListRect.left}px`;
            inkBar.style.display = 'block';
        }
    }
    
    // 更新移动端按钮活动状态
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('ant-btn-primary');
        if (btn.getAttribute('data-tab') === tabKey) {
            btn.classList.add('active');
            btn.classList.add('ant-btn-primary');
        }
    });
    
    // 更新标签内容显示
    document.querySelectorAll('.ant-tabs-tabpane').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('ant-tabs-tabpane-active');
        content.setAttribute('aria-hidden', 'true');
        content.tabIndex = -1;
        
        if (content.id === `tab-content-${tabKey}`) {
            content.style.display = 'block';
            content.classList.add('ant-tabs-tabpane-active');
            content.setAttribute('aria-hidden', 'false');
            content.tabIndex = 0;
        }
    });
    
    // 更新报告内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
        
        if (content.id === `tab-content-container-${tabKey}`) {
            content.style.display = 'block';
            content.classList.add('active');
        }
    });
    
    // 更新当前标签名称
    const currentTabNameElement = document.getElementById('current-tab-name');
    let tabName = '';
    if (currentTabNameElement) {
        const activeTabBtn = document.querySelector(`.ant-tabs-tab[data-tab="${tabKey}"] .ant-tabs-tab-btn`);
        if (activeTabBtn) {
            tabName = activeTabBtn.textContent;
            currentTabNameElement.textContent = tabName;
        }
    }
    
    // 在移动端视图中隐藏报告头部信息，仅显示tab标题
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        // 隐藏报告头部信息
        const reportHeader = document.querySelector('.report-header');
        if (reportHeader) {
            reportHeader.style.display = 'none';
        }
    }
    
// 更新移动端主标题
const mobileReportTitle = document.querySelector('.mobile-report-title');
if (mobileReportTitle && tabName) {
    const reportData = window.reportData || {};
    const title = reportData.title || document.title;
    // 移动端不拼接tab名，只显示报告标题
    mobileReportTitle.textContent = title;
}

// 更新移动端Tab标题
const mobileTabTitle = document.querySelector('.mobile-tab-title');
if (mobileTabTitle && tabName) {
    mobileTabTitle.textContent = tabName;
}

// 在移动端视图中处理标题显示
if (window.innerWidth < 768) {
    // 隐藏报告头部中的标题信息，只保留移动端tab标题
    const reportHeader = document.querySelector('.report-header');
    if (reportHeader) {
        reportHeader.style.display = 'none';
    }
}    // 重新生成导航
    if (window.initializeNavigation) {
        setTimeout(() => {
            window.initializeNavigation();
        }, 200);
    }
}

// 生成内容区域
function generateContent(data) {
    if (!data || data.length === 0 || !data[0].tabList) return;
    
    const reportData = data[0];
    const isMobile = window.innerWidth < 768; // 检查是否是移动端视图
    
    reportData.tabList.forEach((tab, tabIndex) => {
        if (!tab.titleList) return;
        
        const tabKey = `tab-${tabIndex}`;
        const tabContentContainer = document.getElementById(`tab-content-container-${tabKey}`);
        
        if (!tabContentContainer) return;
        
        // 清空现有内容
        tabContentContainer.innerHTML = '';
        
        // 为每个一级标题创建section
        tab.titleList.forEach((title, titleIndex) => {
            if (title.type !== 'h1') return;
            
            const sectionId = `section-${tabIndex}-${titleIndex}`;
            const section = document.createElement('section');
            section.id = sectionId;
            section.className = 'content-section';
            
            // 创建标题容器，包含标题和折叠按钮
            const headerDiv = document.createElement('div');
            headerDiv.className = 'section-header';
            
            // 添加一级标题，使用div元素渲染
            const h1Element = document.createElement('div'); 
            h1Element.textContent = title.title;
            h1Element.className = 'h1-title'; 
            headerDiv.appendChild(h1Element);
            
            // 添加折叠按钮
            const toggleBtn = document.createElement('span');
            toggleBtn.className = 'section-toggle-btn anticon anticon-down';
            // 添加备选SVG图标
            toggleBtn.innerHTML = '<svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg>';
            headerDiv.appendChild(toggleBtn);
            
            section.appendChild(headerDiv);
            
            // 创建内容容器，将所有内容放在这个容器中
            const contentContainer = document.createElement('div');
            contentContainer.className = 'section-content-container';
            contentContainer.setAttribute('data-section', sectionId);
            section.appendChild(contentContainer);
            
            // 为折叠按钮添加点击事件
            toggleBtn.addEventListener('click', function() {
                if (contentContainer.classList.contains('collapsed')) {
                    // 展开内容
                    contentContainer.classList.remove('collapsed');
                    toggleBtn.className = 'section-toggle-btn anticon anticon-down';
                    toggleBtn.innerHTML = '<svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg>';
                } else {
                    // 折叠内容
                    contentContainer.classList.add('collapsed');
                    toggleBtn.className = 'section-toggle-btn anticon anticon-up';
                    toggleBtn.innerHTML = '<svg viewBox="64 64 896 896" focusable="false" data-icon="up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path></svg>';
                }
            });
            
            // 添加子内容到内容容器中
            if (title.titleList && title.titleList.length > 0) {
                generateSectionContent(contentContainer, title.titleList);
            }
            
            tabContentContainer.appendChild(section);
        });
    });
}

// 生成章节内容
function generateSectionContent(parentElement, contentList) {
    if (!contentList || !contentList.length) return;
    
    contentList.forEach(item => {
        if (item.type === 'h2') {
            // 创建二级标题
            const h2Element = document.createElement('div'); // 使用div元素表示二级标题
            h2Element.textContent = item.title;
            h2Element.id = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            h2Element.className = 'h2-title';
            parentElement.appendChild(h2Element);
            
        } else if (item.type === 'h3') {
            // 创建三级标题
            const h3Element = document.createElement('div'); // 使用div元素表示三级标题
            h3Element.textContent = item.title; 
            h3Element.id = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            h3Element.className = 'h3-title';
            parentElement.appendChild(h3Element);
            
        } else if (item.type === 'text') {
            // 创建文本内容，不添加展开按钮
            const textDiv = document.createElement('div');
            textDiv.className = 'section-content';
            // 直接使用内容，不添加额外元素
            textDiv.innerHTML = item.content;
            // 设置字体大小
            textDiv.style.fontSize = '14px';
            parentElement.appendChild(textDiv);
            
        } else if (item.type === 'tips') {
            // 创建提示框，使用Tips组件渲染
            const tipContainer = document.createElement('div');
            tipContainer.className = 'section-content';
            parentElement.appendChild(tipContainer);
            
            // 使用Tips类创建提示
            if (window.Tips) {
                const tips = new window.Tips(tipContainer);
                // 使用Tips类的updateTips方法，格式化数据
                tips.updateTips({
                    title: item.name,
                    content: item.content // 使用content作为内容
                });
            }
            
        } else if (item.type === 'table') {
            // 创建表格容器
            const tableContainer = document.createElement('div');
            tableContainer.className = 'section-content table-container';
            parentElement.appendChild(tableContainer);
            
            // 使用Table.js渲染表格
            if (window.Table) {
                // 直接使用Table组件渲染
                const tableInstance = new window.Table(tableContainer);
                
                // 配置表格属性
                const tableConfig = {
                    columns: item.columns || [],
                    dataSource: item.dataSource || [],
                    title: item.title || '',
                    size: item.size || 'middle',
                    pagination: item.pagination !== false && item.dataSource && item.dataSource.length > 10,
                    pageSize: item.pageSize || 10
                };
                
                // 渲染表格
                tableInstance.render(tableConfig);
            } else {
                // 如果Table类未加载，显示加载信息并尝试延迟加载
                tableContainer.innerHTML = '<div class="loading">表格加载中...</div>';
                
                // 延迟500ms后尝试再次加载Table组件
                setTimeout(() => {
                    if (window.Table) {
                        tableContainer.innerHTML = '';
                        const tableInstance = new window.Table(tableContainer);
                        tableInstance.render({
                            columns: item.columns || [],
                            dataSource: item.dataSource || [],
                            title: item.title || '',
                            size: item.size || 'middle',
                            pagination: item.pagination !== false && item.dataSource && item.dataSource.length > 10,
                            pageSize: item.pageSize || 10
                        });
                    } else {
                        tableContainer.innerHTML = '<div class="error">表格组件加载失败，请确保table.js已正确加载</div>';
                    }
                }, 500);
            }
        } else if (item.type === 'chartRing') {
            // 创建提示框，使用Tips组件渲染
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '30vw';
            container.style.margin = '10px 0';
            parentElement.appendChild(container);
            // 使用chartRing类创建图标
            if (window.ChartRing) {
                const chartInstance = new window.ChartRing(container);
                // 渲染表格
                setTimeout(() => {
                    chartInstance.render(item);
                },30)
            }
        } else if (item.type === 'chartBar') {
            // 创建提示框，使用Tips组件渲染
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '30vw';
            container.style.margin = '10px 0';
            parentElement.appendChild(container);
            // 使用chartRing类创建图标
            if (window.ChartBar) {
                const chartInstance = new window.ChartBar(container);
                // 渲染表格
                setTimeout(() => {
                    chartInstance.render(item);
                },30)
            }
            
        }
        
        // 处理嵌套内容，但避免在文本内容后面添加多余的展开按钮
        if ((item.titleList && item.titleList.length > 0) && item.type !== 'text') {
            generateSectionContent(parentElement, item.titleList);
        }
        
        if ((item.contentList && item.contentList.length > 0) && item.type !== 'text') {
            generateSectionContent(parentElement, item.contentList);
        }
    });
}

// 初始化报告数据
async function initializeReportData() {
    const data = await loadReportData();
    try {
        // 存储报告数据到全局变量，以便在切换标签时使用
        window.reportData = data[0] || {};
        
        updateReportHeader(data);
        generateTabs(data);
        generateContent(data);
        
        // 延迟初始化导航，确保DOM已完全渲染
        setTimeout(() => {
            if (window.initializeNavigation) {
                window.initializeNavigation();
            }
            
            // 初始化响应式布局
            handleResponsiveLayout();
            
            // 确保在初始加载时正确处理移动端视图
            if (window.innerWidth < 768) {
                // 隐藏报告头部信息，只显示移动端tab标题
                const reportHeader = document.querySelector('.report-header');
                if (reportHeader) {
                    reportHeader.style.display = 'none';
                }
                
                // 确保移动端tab标题显示
                const mobileTabHeader = document.querySelector('.mobile-tab-header');
                if (mobileTabHeader) {
                    mobileTabHeader.style.display = 'block';
                }
            }
        }, 300);
    } catch (error) {
        console.error('渲染报告数据时出错:', error);
    }
}

// 处理响应式布局
function handleResponsiveLayout() {
    const isMobile = window.innerWidth < 768;
    
    // 处理移动端显示
    const mobileHeader = document.querySelector('.mobile-report-header');
    const mobileButtons = document.querySelector('.mobile-buttons');
    const mobileTabHeader = document.querySelector('.mobile-tab-header');
    const desktopHeader = document.querySelector('.report-header');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileHeader && mobileButtons && desktopHeader && sidebar) {
        if (isMobile) {
            // 移动端显示：显示移动端专用元素，隐藏PC端元素
            mobileHeader.style.display = 'block';
            mobileButtons.style.display = 'flex';
            if (mobileTabHeader) {
                mobileTabHeader.style.display = 'block';
            }
            desktopHeader.style.display = 'none';
            sidebar.style.display = 'none';
            
            // 隐藏所有报告头部信息，只在移动端tab标题中显示
            const reportHeader = document.querySelector('.report-header');
            if (reportHeader) {
                reportHeader.style.display = 'none';
            }
        } else {
            // PC端显示：隐藏移动端专用元素，显示PC端元素
            mobileHeader.style.display = 'none';
            mobileButtons.style.display = 'none';
            if (mobileTabHeader) {
                mobileTabHeader.style.display = 'none';
            }
            desktopHeader.style.display = 'block';
            sidebar.style.display = 'block';
        }
    }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
    handleResponsiveLayout();
});

// 导出到全局
window.dataLoader = {
    loadReportData,
    updateReportHeader,
    generateTabs,
    generateContent,
    initializeReportData,
    switchTab
};

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化报告数据
    window.dataLoader.initializeReportData();
});
