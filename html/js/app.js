// 用于初始化所有组件和处理全局功能

// 初始化标签页
function initializeTabs() {
  // 标签页交互已经移至dataLoader.js中处理
  console.log('标签页初始化交由dataLoader处理');
}

// 检测设备类型
function isMobile() {
  return window.innerWidth < 768;
}

// 处理响应式布局
function handleResponsiveLayout() {
  // 响应式布局已经移至dataLoader.js中处理
  console.log('响应式布局交由dataLoader处理');
}

// 添加折叠功能 - 禁用自动添加折叠图标，避免▼符号累积问题
function addCollapseHandlers() {
  // 检查是否已经存在折叠图标，避免重复添加
  document.querySelectorAll('.content-section > h2').forEach(heading => {
    // 如果已经有折叠图标，则跳过
    if (heading.querySelector('.collapse-icon')) {
      return;
    }

    // 添加点击事件但不添加折叠图标，以避免累积▼符号
    heading.addEventListener('click', function () {
      // 获取该标题下的内容容器
      const parentSection = heading.parentElement;
      const contentContainer = parentSection.querySelector('.section-content-container');

      if (contentContainer) {
        // 切换显示/隐藏状态
        const isCollapsed = contentContainer.style.display === 'none';
        contentContainer.style.display = isCollapsed ? 'block' : 'none';
      }
    });
  });
}

// 添加平滑滚动
function addSmoothScroll() {
  // 为导航菜单项添加平滑滚动
  document.querySelectorAll('.menu-title').forEach(menuItem => {
    menuItem.addEventListener('click', function (e) {
      const target = this.getAttribute('data-target');
      if (target) {
        const targetElement = document.getElementById(target);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// 初始化交互功能
function initializeInteractions() {
  // 延迟执行，确保动态内容已加载
  setTimeout(() => {
    // 先移除所有折叠图标，然后再添加处理程序 (不会添加新的图标)
    removeAllCollapseIcons();

    // 不再添加折叠图标，但保留折叠功能
    addCollapseHandlers();
    addSmoothScroll();
  }, 500);
}

// 初始化页面组件
function initializeComponents() {
  // 由于我们现在完全依赖data.json的数据，所以初始化工作主要在dataLoader.js中完成
  // 这里只做一些额外的增强

  // 监听动态内容变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 内容变化时，初始化交互功能
        initializeInteractions();
      }
    });
  });

  // 观察报告内容容器
  const reportContainer = document.getElementById('report-content-container');
  if (reportContainer) {
    observer.observe(reportContainer, { childList: true, subtree: true });
  }
}

// 清除所有折叠图标，防止▼符号累积
function removeAllCollapseIcons() {
  // 移除所有折叠图标
  document.querySelectorAll('.collapse-icon').forEach(icon => {
    icon.parentNode.removeChild(icon);
  });

  // 查找所有可能的▼符号文本节点并移除
  document.querySelectorAll('.content-section > h2').forEach(heading => {
    // 获取所有文本节点
    const textNodes = [];
    heading.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
        textNodes.push(node);
      }
    });

    // 检查并移除包含▼的节点
    textNodes.forEach(node => {
      if (node.textContent && node.textContent.includes('▼')) {
        const newText = node.textContent.replace(/▼/g, '');
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = newText;
        } else {
          node.innerHTML = node.innerHTML.replace(/▼/g, '');
        }
      }
    });
  });
}


// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function () {
  // 移除所有可能存在的折叠图标
  removeAllCollapseIcons();

  // 初始化组件和交互 (修改后不再添加折叠图标)
  initializeComponents();

  // 监听DOM变化，持续移除折叠图标
  const observer = new MutationObserver((mutations) => {
    removeAllCollapseIcons();
  });

  // 观察整个文档以捕获所有变化
  observer.observe(document.body, { childList: true, subtree: true });

  // 报告数据的加载和渲染由dataLoader.js处理
  console.log('页面初始化完成，等待数据加载...');
});
