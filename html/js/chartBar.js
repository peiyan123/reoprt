/**
 * ChartBar组件 - 根据JSON数据渲染，基于echarts开发
 * 使用方法：
 * const chartBarInstance = new ChartBar(containerElement);
 * chartBarInstance.render({
 *   title: '表格标题', // 表格标题
 *   yName: {name: '车辆数量（辆）'}] - y轴描述
 *   dataSource: [{ "value": 70.5, "name": '垃圾箱数量（万个）', ...], 
 * });
 */

/**
 * 环形图表类 - 环形图表组件
 */
class ChartBar {
    /**
     * 构造函数
     * @param {HTMLElement} container - 容器元素
     */
    constructor(container) {
        this.container = container;
        this.baseOption = {
            backgroundColor: '#FAFAFA',
            title: {
                text: '',
                left: '20',
                textStyle: {
                    color: '#303133',          // 字体颜色
                    fontSize: 14,           // 字体大小（px）
                    lineHeight: 20,
                    fontWeight: '500'     // 加粗程度（normal/bold/bolder/lighter）
                }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c}'
            },
            grid: {
              top: '25%',
              left: '10%',
              right: '10%',
              bottom: '15%'
            }
        };
    }

    /**
     * 渲染
     * @param {Object} options - 表格配置选项
     * @param {string} options.title - 标题
     * @param {Object} [options.yName={name: '车辆数量（辆）'}] - y轴描述
     * @param {Array} options.dataSource - 数据源
     */
    render(options = {}) {
        if (!this.container) return;
        this.chart = echarts.init(this.container);
        // 设置属性
        this.baseOption.title.text = options.title;
        // y轴的描述
        if (options.yName) {
          this.baseOption.yAxis = {
            type: 'value',
            splitNumber: 10,
            name: '车辆数量（辆）',  // 标题文本内容
            nameLocation: 'end',  // 标题位置(end/start/center)
            nameTextStyle: {  // 标题样式
                color: '#666',
                fontSize: 12
            },
            nameGap: 15,  // 标题与轴线距离
            ...options.yName
          }
        }
        // x轴
        if (options.dataSource) {
          const total = options.dataSource.reduce((t,i) => (t+i.value), 0)
          this.baseOption.xAxis = {
            type: 'category',
            data: options.dataSource.map(d => d.name)
          };
          // 柱状图
          this.baseOption.series = [{
            data: options.dataSource.map(d => d.value),
            barWidth: '30%',
            type: 'bar',
            name: options.title,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 1, color: '#188df0' }
              ])
            },
            label: {
              show: true,     // 显示标签
              position: 'top',// 标签位置（顶部）
              formatter: '{c}',// 显示数据值
              textStyle: {
                color: '#333',// 文字颜色
                fontSize: 12  // 文字大小
              },
              formatter: (params) => {
                const value = params.value;
                return `${value} (${((value / total) * 100).toFixed(2)}%)`;
              }
            }
          }]
        }
        this.chart.setOption(this.baseOption)
        window.addEventListener('resize', () => {
            this.chart.resize()
        });
    }
    
}

// 导出到全局
window.ChartBar = ChartBar;
