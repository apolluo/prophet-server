# 两个service协同工作

* 云服务-提供对外访问
* devnet-提供数据服务
* UDP

### 云服务

1. 将任务存到数据库供devnet定时获取
2. 定期查询任务，看看任务进度(任务钩子？)
3. 任务完成时，进行提示或相应操作

### devnet
因为devnet无法通过外网访问，所以只有devnet定时从云服务器获取任务（考虑服务器缓存）。
1. 定时获取任务
2. 将任务结果通知云

## 自动笔记

### 网页插件
参考印象笔记
后期考虑自动识别、自动记录、自动分析tag
### 客户端
参考印象笔记


### 国外代理
1. 云服务建立访问国外网站的任务
2. devnet定时获取任务
3. devnet访问国外网站，并将结果通知到云服务
4. 云定时查询任务状态，更新任务进度
4. 任务完成，云服务存本地数据库/本地文件/本地缓存，同时刷新页面。（要考虑资源文件）