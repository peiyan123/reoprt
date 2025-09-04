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
                "title": "综合分析",
                "type": "h1",
                "titleList": [
                  {
                    "title": "项目概述",
                    "type": "h2"
                  },
                  {
                    "type": "text",
                    "content": "这里是文本内容，文本内容需直接返回css样式支持的html格式字符串"
                  },
                  {
                    "type": "tips",
                    "name": "下月改善建议",
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
                      { "name": "获取用户信息", "method": "GET", "url": "/api/user/info"},
                      { "name": "更新用户信息", "method": "POST", "url": "/api/user/update"}
                    ]
                  },
                  {
                    "title": "项目概述",
                    "type": "h2"
                  },
                  {
                    "title": "项目概述",
                    "type": "h3"
                  }
                ]
              },
              {
                "title": "综合分析",
                "type": "h1",
                "titleList": [
                  {
                    "title": "项目概述",
                    "type": "h2",
                    "contentList": [
                      {
                        "type": "text",
                        "content": "这里是文本内容，文本内容需直接返回css样式支持的html格式字符串"
                      },
                      {
                        "type": "tips",
                        "name": "下月改善建议",
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
    
    // 更新公司名和时间
    const companyElements = document.querySelectorAll('.company-name');
    companyElements.forEach(element => {
        element.textContent = reportData.name;
    });
    
    const dateElements = document.querySelectorAll('.generate-date');
    dateElements.forEach(element => {
        if (element.closest('.mobile-report-info')) {
            element.textContent = reportData.time;
        } else {
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
    document.querySelectorAll('.ant-tabs-tab').forEach(tab => {
        tab.classList.remove('ant-tabs-tab-active');
        if (tab.getAttribute('data-tab') === tabKey) {
            tab.classList.add('ant-tabs-tab-active');
        }
    });
    
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
    if (currentTabNameElement) {
        const activeTabBtn = document.querySelector(`.ant-tabs-tab[data-tab="${tabKey}"] .ant-tabs-tab-btn`);
        if (activeTabBtn) {
            currentTabNameElement.textContent = activeTabBtn.textContent;
        }
    }
    
    // 重新生成导航
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
            
            // 添加一级标题，确保不添加额外序号
            const h1Element = document.createElement('h2'); // 在HTML结构中使用h2表示一级标题
            h1Element.textContent = title.title;
            // 防止自动编号样式
            h1Element.className = 'no-auto-numbering'; 
            section.appendChild(h1Element);
            
            // 创建内容容器，将所有内容放在这个容器中
            const contentContainer = document.createElement('div');
            contentContainer.className = 'section-content-container';
            section.appendChild(contentContainer);
            
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
            const h2Element = document.createElement('h3'); // 在HTML中使用h3表示二级标题
            h2Element.textContent = item.title;
            h2Element.id = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            h2Element.className = 'no-auto-numbering'; // 防止自动编号样式
            parentElement.appendChild(h2Element);
            
        } else if (item.type === 'h3') {
            // 创建三级标题
            const h3Element = document.createElement('h4'); // 在HTML中使用h4表示三级标题
            h3Element.textContent = item.title; 
            h3Element.id = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            h3Element.className = 'no-auto-numbering'; // 防止自动编号样式
            parentElement.appendChild(h3Element);
            
        } else if (item.type === 'text') {
            // 创建文本内容，不添加展开按钮
            const textDiv = document.createElement('div');
            textDiv.className = 'section-content';
            // 直接使用内容，不添加额外元素
            textDiv.innerHTML = item.content;
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
    const desktopHeader = document.querySelector('.report-header');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileHeader && mobileButtons && desktopHeader && sidebar) {
        if (isMobile) {
            mobileHeader.style.display = 'block';
            mobileButtons.style.display = 'flex';
            desktopHeader.style.display = 'none';
            sidebar.style.display = 'none';
        } else {
            mobileHeader.style.display = 'none';
            mobileButtons.style.display = 'none';
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
