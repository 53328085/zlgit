import server  from './index'
// 测试 新技术 
export class Test {
    static User = (params) => server.post(`/users`, params)
}
// zl api start
// 登录
export class Login {
    static SystemConfig = (url) => server.get(`/SystemConfig/GetSystemConfigInfo?url=${url}`)
    static LoginByName = (data = {}) => server.post(`/General/User/LoginByName?name=${data.name}&pwd=${data.pwd}`)      // 根据用户名登录

    static GetVerification = (mobile) => server.post(`/General/User/GetCode?mobile=${mobile}`)    // 获取验证吗
    static LoginByPhone = (data = {}) => server.post(`/User/LoginByMobile?mobile=${data.mobile}&code=${data.code}`)   // 根据手机号登录
    static GetMenuByRoleType = (params = {}) => server.get('/Project/GetMenuByRoleType', { params }) // 根据登录人查询项目和侧边栏
    static SystemQueryLoginConfigInfo = (data = {}) => server.get('/System/QueryLoginConfigInfo', data) // 查询登录页配置
    static UpdateCurrentAccount = ({ mobile, pwd, Pwd }) => server.post(`User/ResetLoginPersonPassword?mobile=${mobile}&pwd=${pwd}&oldPwd=${Pwd}`)
    static LoginOut = () => server.post('User/Logout')
    static GetUseMenus = (projectId, userId) => server.get(`/User/GetUseMenus?projectId=${projectId}&userId=${userId}`)
}

// 项目列表
export class ProjectList {
    static queryProject = ({pageNum, pageSize, name='', state=0} = {}) => server.get(`/General/PlatConfig/QueryProjects?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&state=${state}`)
    static createProject = (data) => server.post('General/PlatConfig/CreateProject', data) // 新增项目
    static QueryMenus = (projectId) => server.get(`General/User/QueryMenus?projectId=${projectId}`)  // 查询菜单栏
}
// 公共模块---项目设置
export class ProjectSetting {
    static QueryProjectInfo = (projectId) => server.get(`/General/ProjectSetting/QueryProjectInfo?projectId=${projectId}`) //  查询项目信息
    static SaveProjectInfo = (params) => server.post(`/General/ProjectSetting/SaveProjectInfo`, params) //  保存项目信息
    static queryProjectPublishInfo = (projectId) => server.get(`/General/ProjectSetting/QueryProjectPublishInfo?projectId=${projectId}`) // 查询项目发布信息
    static publishProject = ({projectId, state}) => server.post(`/General/ProjectSetting/PublishProject?projectId=${projectId}&state=${state}`) //  项目发布/取消发布
    static DeleteProject = (projectId) => server.post(`/General/ProjectSetting/DeleteProject?projectId=${projectId}`) //  删除项目
}
// 公共模块---区域设置
export class AreaSetting {
    static QueryAreaLevels = (projectId) => server.get(`/General/ProjectSetting/QueryAreaLevels?projectId=${projectId}`) //  查询区域
    static InsertAreaLevel = ({projectId, level,name, type}) => server.post(`/General/ProjectSetting/InsertAreaLevel?projectId=${projectId}&level=${level}&name=${name}&type=${type}`) //  插入区域
    static DeleteAreaLevel = ({projectId,level}) => server.delete(`/General/ProjectSetting/DeleteAreaLevel?projectId=${projectId}&level=${level}`) //  删除区域
    static UpdateAreaLevel = ({projectId,level, name, type}) => server.post(`/General/ProjectSetting/UpdateAreaLevel?projectId=${projectId}&level=${level}&name=${name}&type=${type}`) //  修改区域
    static QueryAreaLevelFields = ({projectId,level}) => server.get(`/General/ProjectSetting/QueryAreaLevelFields?projectId=${projectId}&level=${level}`) //  查询字段

}

// zl api end
// 主页
export class Home {
    static BaseInfoSummary = (projectId) => server.get(`/Home/BaseInfoSummary?projectId=${projectId}`)      // 告警信息和客户信息汇总
    static TransactionStatistics = (projectId) => server.get(`/Home/TransactionStatistics?projectId=${projectId}`)      // 项目收入趋势和支付方式
    static EnergyRanking = (projectId) => server.get(`/Home/EnergyRanking?projectId=${projectId}`)      // 能耗排名
    static EnergyTrends = (projectId) => server.get(`/Home/EnergyTrends?projectId=${projectId}`) // 用电/用水/用气趋势
  

}
//账号管理
export class User {
    static GetUsersPage=(data={})=>server.get(`User/GetUsers`,{params:data})//获取用户列表
    static GetRoleType=()=>server.get(`/User/GetRoleType`)//获取用户角色
    static AddUser=(data)=>server.post(`/User/AddUser`,data) //添加用户
    static UpdateUser=(data)=>server.post(`/User/UpdateUser`,data)//编辑用户
    static ResetPassword=(data)=>server.post(`/User/ResetPassword?userId=${data.userId}&pwd=${data.pwd}`)//重置用户密码
    static DeleteUse=(id)=>server.post(`/User/DeleteUser?id=${id}`)//删除用户
}
// 项目管理
export class Project {
    static queryProject = ({pageNum, pageSize, projectName='', valid=0} = {}) => server.get(`/Project/QueryProjects?pageNum=${pageNum}&pageSize=${pageSize}&projectName=${projectName}&valid=${valid}`)
    static queryProjectByName = (data) => server.post('/Project/QueryByProjectName', data) // 查询
    static addProject = (data) => server.post('/Project/AddProject', data) // 新增
    static UpdateBaseProject = (data) => server.post('/Project/UpdateBaseProject', data) // 编辑
    static dellProject = (projectId) => server.delete(`/Project/DeleteProject?projectId=${projectId}`) // 删除
    static UpdateProjectEnable = (projectId, state, code) => server.get(`/Project/UpdateProjectEnable?projectId=${projectId}&state=${state}&code=${code}`) // 修改发布状态
    static DeletePolicyFile = ({policyFileKey='', projectId=''}={}) => server.delete(`/Project/DeletePolicyFile?policyFileKey=${policyFileKey}&projectId=${projectId}`) // 删除政策性文件
    static QueryProjectById = (projectId) => server.get(`/Project/QueryProjectById?projectId=${projectId}`) // 查询政策性文件
    // 修改项目-用户授权
    static getProjectUser = (projectId) => server.get(`/User/GetProjectManager?projectId=${projectId}`) // 获取项目管理员用户
    static addProjectUser = (data) => server.post(`/User/AddProjectManager`, data) // 添加项目管理员
    static getOperationManagerUsers = (data) => server.get(`/User/GetOperationManagerUsers`) // 获取运营管理员列表  
    static GetProjectOperator = (projectId) => server.get(`/User/GetProjectOperator?projectId=${projectId}`) // 获取运维人员
    static AddProjectOperator = (params) => server.post(`/User/AddProjectOperator`, params) //新增运维人员    
    static DeleteProjectUser = (projectId, userId) => server.delete(`/User/DeleteProjectUser?projectId=${projectId}&userId=${userId}`) // 删除项目管理员或者运维人员
    static DeleteOperationManager = (projectId, userId) => server.delete(`/User/ProjectDeleteOperationManager?projectId=${projectId}&userId=${userId}`) // 删除运营管理员
    static getOperationUsers = (projectId) => server.get(`/User/GetOperationManagerUsersByProjectId?projectId=${projectId}`) // 获取已授权的运营管理员列表
    static ProjectAddOperationManager = (projectId, userId) => server.get(`/User/ProjectAddOperationManager?projectId=${projectId}&userId=${userId}`) // 授权运营管理员项目权限
    static SetFunction = (data) => server.post(`/User/SetFunction`, data) // 功能授权
    static GetMenus = ({projectId='', userId=''}={}) => server.get(`/User/GetMenus?projectId=${projectId}&userId=${userId}`) // 获取功能菜单列表
    // 修改项目-设备配置--接入设备
    static QueryDeviceCategoryListInfos = (projectId) => server.get(`/Project/QueryDeviceCategoryListInfos?projectId=${projectId}`) // 查询项目中接入的设备类型列表详情
    static QueryInsertDeviceCategoryList = (projectId) => server.get(`/Project/QueryInsertDeviceCategoryList?projectId=${projectId}`) // 新增项目 下拉列表设备型号
    static QueryDataGroup = () => server.get(`/Project/QueryDataGroup`) // 查询数据组
    static QueryDeviceCategoryList = () => server.get('/Project/QueryDeviceCategoryList') // 获取设备类型
    static QueryDeviceCategoryPoints = (projectId, categoryId) => server.get(`/Project/QueryDeviceCategoryPoints?projectId=${projectId}&categoryId=${categoryId}`) // 查询项目设备型号点位信息
    static AddDeviceCategoryPoints = (form) => server.post(`/Project/AddDeviceCategoryPoints`, form)  // 新增项目设备型号和点位信息
    static UpdateDeviceCategoryPoints = (form) => server.post(`/Project/UpdateDeviceCategoryPoints`, form) // 编辑项目设备型号和点位信息
    static DeleteProjectDeviceCategory = (projectCategoryId) => server.delete(`/Project/DeleteProjectDeviceCategory?projectCategoryId=${projectCategoryId}`) // 删除设备型号和点位信息
    // 修改项目-设备配置--接入网关
    static QueryInsertGatewayCategoryList = (projectId) => server.get(`/Project/QueryInsertGatewayCategoryList?projectId=${projectId}`) // 查询新增的网关型号列表
    static AddProjectGatewayCategory = (form) => server.post(`/Project/AddProjectGatewayCategory`, form) // 新增项目网关型号
    static QueryGatewayCategoryList = (projectId) => server.get(`/Project/QueryGatewayCategoryList?projectId=${projectId}`) // 查询项目网关型号列表
    static UpdateProjectGatewayCategory = (form) => server.post(`/Project/UpdateProjectGatewayCategory`, form) // 编辑项目网关型号
    static DeleteProjectGatewayCategory = (projectGatewayCategoryId) => server.get(`/Project/DeleteProjectGatewayCategory?projectGatewayCategoryId=${projectGatewayCategoryId}`) // 删除
    // 修改项目-报警方案
    static QueryProjectAlarmSolution = ({projectId, pageNum = 1, pageSize = 10} = {}) => server.get(`/Project/QueryProjectAlarmSolution?projectId=${projectId}&pageNum=${pageNum}&pageSize=${pageSize}`) // 查询项目报警方案
    static AddProjectAlarmSolution = (params) => server.post(`/Project/AddProjectAlarmSolution`, params) // 新增
    static UpdateProjectAlarmSolution = (params) => server.post(`/Project/UpdateProjectAlarmSolution`, params) // 编辑
    static DeleteProjectAlarmSolution = (projectAlarmSolutionId) => server.delete(`/Project/DeleteProjectAlarmSolution?projectAlarmSolutionId=${projectAlarmSolutionId}`) // 删除
    static DeleteProjectAlarmSolutionEvent = (projectAlarmSolutionEventId) => server.delete(`/Project/DeleteProjectAlarmSolutionEvent?projectAlarmSolutionEventId=${projectAlarmSolutionEventId}`) // 删除报警事件
    static GetAlarmType = () => server.get(`/Project/GetAlarmType`) // 查询报警类型列表
    // 修改项目--自定义
    static QueryProjectStyle = (projectId) => server.get(`/Project/QueryProjectStyle?projectId=${projectId}`) // 查询项目自定义信息
    static UpdateProjectStyle = (form) => server.post(`/Project/UpdateProjectStyle`, form) // 编辑项目自定义信息
    // 修改项目--账户信息
    static GetAccountInfo = (projectId) => server.post(`/Project/GetAccountInfo?projectId=${projectId}`) // 查询账户信息
    static BankExamineRefuse = (merchantId) => server.get(`/Project/BankExamineRefuse?merchantId=${merchantId}`) // 银行审核拒绝
    // 修改项目-- 拉闸信息
    static SwitchQuery = (projectId) => server.post(`/Project/QuerySwitchSetting?projectId=${projectId}`) // 查询拉闸设置
    static SwitchSetting = ({projectId='',balanceArrearageSwitchEnabled=0, balanceArrearageThreshold=0 }={}) => server.post(`/Project/SwittchSetting?projectId=${projectId}&balanceArrearageSwitchEnabled=${balanceArrearageSwitchEnabled}&balanceArrearageThreshold=${balanceArrearageThreshold}`) // 查询拉闸设置
    // 修改项目--项目结算
    static SettlementSetting = (data) => server.post(`/Project/SettlementSetting`, data) // 设置项目结算
    static GetSettlementSetting = (projectId) => server.get(`/Project/GetSettlementSetting?projectId=${projectId}`) // 设置项目结算
}
// 设备监控
export class Meter {
    static Overview = ({projectId,meterType,bindStatus, lineStatus,alike='', pageNum = 1, pageSize = 12} = {}) => server.get(`/Meter/Overview?projectId=${projectId}&meterType=${meterType}&lineStatus=${lineStatus}&bindStatus=${bindStatus}&pageNum=${pageNum}&pageSize=${pageSize}&alike=${alike}`) // 查询设备监控
    
}
// 设备详情
export class DeviceDtl {
    static Detail = (id) => server.get(`/Meter/Detail?id=${id}`) // 设备详情
    static RunTimePoints = (sn) => server.get(`/Meter/RunTimePoints?sn=${sn}`) // 实时数据
    static HistoryTrend = (params) => server.post(`/Meter/HistoryTrend`, params) // 监测趋势-标准
    static HistoryTable = (params) => server.post(`/Meter/HistoryTable`, params) // 监测趋势-报表
    static EnergyActuary = (sn) => server.get(`/Meter/EnergyActuary?sn=${sn}`) // 能耗统计
    static EnergyTrend = (sn, type=1) => server.get(`/Meter/EnergyTrend?sn=${sn}&type=${type}`) // 能耗图表
    static EnergyReport = (sn, type=1) => server.get(`/Meter/EnergyReport?sn=${sn}&type=${type}`) // 能耗报表
    static AlarmLog = (params) => server.post(`/Meter/AlarmLog`, params) // 能耗报表
}
// 数据报表
export class DataReport {
    static RevenueSummary = (params) => server.post(`/DataReport/RevenueSummary`, params) // 项目营收汇总
    static EnergyConsum = (charge, params) => server.post(`/DataReport/EnergyConsumptionSummary?charge=${charge}`, params) // 项目能耗费汇总
    static HistoryTable = (params) => server.post(`/DataReport/PropertyFeeSummary`, params) // 项目物业费汇总
    static PublicEnergy = (params) => server.post(`/DataReport/PublicEnergyConsumptionAnalysis`, params) // 项目公共能耗分析
    static GetCustomerBaseInfos = (projectId) => server.post(`/DataReport/GetCustomerBaseInfos?projectId=${projectId}`) // 客户对账明细 - 客户查询
    static GetCustomers = (account, params) => server.post(`/DataReport/GetCustomers?account=${account}`, params)                                   // 客户能耗分析  查询客户基础信息 
     
    static CustomerDtl = ({customerId='', transactionType, startDate='', endDate='', pageNum= 1, pageSize=20} = {}) => server.post(`/DataReport/CustomerReconciliationDetails?customerId=${customerId}&transactionType=${transactionType}&startDate=${startDate}&endDate=${endDate}&pageNum=${pageNum}&pageSize=${pageSize}`) // 查询客户对账明细
    static ConsumptionDetails = ({customerId='', transactionId='', transactionTime=''} = {}) => server.post(`/DataReport/ConsumptionDetails?customerId=${customerId}&transactionId=${transactionId}&transactionTime=${transactionTime}`) // 消费明细
    static ConsumptionAnalysis = ({customerId, date, yearMonthDay, type} = {}) => server.post(`/DataReport/CustomerEnergyConsumptionAnalysis?customerId=${customerId}&date=${date}&yearMonthDay=${yearMonthDay}&type=${type}`) // 客户能耗分析 
    static PropertyFeeAnalysis = ({customerId, date, yearMonthDay} = {}) => server.post(`/DataReport/PropertyFeeAnalysis?customerId=${customerId}&date=${date}&yearMonthDay=${yearMonthDay}`) // 客户物业分析 
}
// 系统配置
export class SystemConfig {
    static DownLoadDriver=()=>server.get(`SystemConfig/DownLoadDriver`)//打印机下载
    static GetSystemConfigInfo = (url) => server.get(`/SystemConfig/GetSystemConfigInfo?url=${url}`) // 查询系统配置
    static UpdateSystemConfigInfo = (form) => server.post(`/SystemConfig/UpdateSystemConfigInfo`, form) // 编辑系统配置
}
//定价方案
export class PriceSolution {
    //水电燃气
    static GetEnablePriceSolution=(solutionName , id)=> server.get(`/PriceSolution/GetEnablePriceSolution?projectId=${id}&solutionName=${solutionName}`) //查询定价方案
    static GetPriceType=()=>server.get(`/PriceSolution/GetPriceType`) //查询定价列表
    static AddProjectRatePriceSolution=(data)=>server.post(`/PriceSolution/AddProjectRatePriceSolution`,data) //新增单、复费率价格方案
    static AddProjectTierPriceSolution=(data)=>server.post(`/PriceSolution/AddProjectTierPriceSolution`,data) //新增阶梯、混合价格方案
    static DeletePriceSolution=(id)=>server.delete(`PriceSolution/DeleteProjectPriceSolution?solutionId=${id}`) //删除价格方案
    static UpdatePriceSolutionName=(data)=>server.post(`PriceSolution/UpdatePriceSolutionName?projectId=${data.projectId}&solutionId=${data.solutionId}&solutionName=${data.solutionName}`) //编辑定价方案名称
    static ModifyProjectRatePriceSolution=(data)=>server.post(`/PriceSolution/ModifyProjectRatePriceSolution`,data) //调价 - 调整费率价格
    static ModifyProjectTierPriceSolution=(data)=>server.post(`/PriceSolution/ModifyProjectTierPriceSolution`,data) //调价 - 调整费率价格
    static GetPriceSolution=(data)=>server.get(`/PriceSolution/GetPriceSolution?projectId=${data.projectId}&solutionId=${data.solutionId}`) //查询调价记录
    static DeleteModifyPriceRecord=(data)=>server.delete(`/PriceSolution/DeleteModifyPriceRecord?solutionId=${data.solutionId}&ratePriceId=${data.ratePriceId}&tierPriceId=${data.tierPriceId}`) //查询调价记录
    static UpdateProjectRatePriceSolution=(data)=>server.post(`/PriceSolution/UpdateProjectRatePriceSolution`,data) //调价记录 - 编辑费率调价记录
    static UpdateProjectTierPriceSolution=(data)=>server.post(`/PriceSolution/UpdateProjectTierPriceSolution`,data) //调价记录 - 编辑阶梯调价记录
    //物业
    static GetEnabledPropertyPriceSolutions=(projectId,solutionName)=>server.post(`/PriceSolution/GetEnabledPropertyPriceSolutions?projectId=${projectId}&solutionName=${solutionName}`) //查询物业方案
    static GetPropertyPriceSolution=(data)=>server.post(`/PriceSolution/GetPropertyPriceSolution?projectId=${data.projectId}&solutionId=${data.solutionId}`) //查询物业方案中的价格
    static AddPropertyPriceSolution=(data)=>server.post(`/PriceSolution/AddPropertyPriceSolution`,data) //添加物业方案
    static ModifyPropertyPrice=(data)=>server.post(`/PriceSolution/ModifyPropertyPrice`,data) //物业方案 - 调价
    static UpdatePropertyPrice=(data)=>server.post(`/PriceSolution/UpdatePropertyPrice`,data) //物业方案调价记录 - 修改待启用的记录
    static UpdatePropertyPriceSolutionName=(data)=>server.post(`/PriceSolution/UpdatePropertyPriceSolutionName?projectId=${data.projectId}&solutionId=${data.solutionId}&name=${data.name}`) //编辑物业方案名称
    static DeletePropertyPrice=(data)=>server.delete(`/PriceSolution/DeletePropertyPrice?solutionId=${data.solutionId}&propertyPriceId=${data.propertyPriceId}`) //删除某个物业方案下的价格记录
    static DeletePropertyPriceSolution=(solutionId)=>server.delete(`/PriceSolution/DeletePropertyPriceSolution?solutionId=${solutionId}`) //删除物业方案

    // static GetPriceSolution=(id)=> server.get(`/PriceSolution/GetPriceSolution?projectId=${id}`) //查询定价方案---已改为上面一个接口
    // static AddSingleRatePriceSolution=(data)=>server.post(`/PriceSolution/AddSingleRatePriceSolution`,data) //新增单费率价格方案---已改为上面一个接口
    // static AddMultiRatePriceSolution=(data)=>server.post(`/PriceSolution/AddMultiRatePriceSolution`,data) //新增复费率价格方案---已改为上面一个接口
    // static AddSingleRateTierPriceSolution=(data)=>server.post(`/PriceSolution/AddSingleRateTierPriceSolution`,data)//新增单费率阶梯价格方案 ---已改为上面一个接口
    // static AddMultiRatePriceTierSolution=(data)=>server.post(`PriceSolution/AddMultiRatePriceTierSolution`,data)//新增复费率阶梯价格方案---已改为上面一个接口
    // static DeletePriceSolution=(id)=>server.delete(`PriceSolution/DeletePriceSolution?solutionId=${id}`) //删除价格方案---已改为上面一个接口
    // static UpdateSingleRatePriceSolution=(data)=>server.post(`/PriceSolution/UpdateSingleRatePriceSolution`,data) //编辑单费率价格方案
    // static UpdateMultiRatePriceSolution=(data)=>server.post(`/PriceSolution/UpdateMultiRatePriceSolution`,data)//编辑复费率价格方案
    // static UpdateSingleRateTierPriceSolution=(data)=>server.post(`/PriceSolution/UpdateSingleRateTierPriceSolution`,data)//编辑单费率阶梯价格方案
    // static UpdateMultiRatePriceTierSolution=(data)=>server.post(`/PriceSolution/UpdateMultiRatePriceTierSolution`,data) //编辑复费率阶梯价格方案
    // static AddPropertyPriceSolution=(data)=>server.post(`/PriceSolution/AddPropertyPriceSolution`,data) //新增物业方案
    // static GetPropertyPriceSolutions=(data)=>server.post(`/PriceSolution/GetPropertyPriceSolutions?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//查询物业方案
    // static UpdatePropertyPriceSolution=(data)=>server.post(`PriceSolution/UpdatePropertyPriceSolution`,data)//编辑物业方案
    // static DeletePropertyPriceSolution=(id)=>server.delete(`/PriceSolution/DeletePropertyPriceSolution?propertyId=${id}`)//删除物业方案
}
//操作日志
export class LogOperation {
    static GetLogOperation = (data) => server.get(`LogOperation/GetLogOperation?start=${data.start}&end=${data.end}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)
}
export const GetLogOperation = (data) => server.get(`LogOperation/GetLogOperation?start=${data.start}&end=${data.end}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)
//保电方案
export class PowerProtect {
    static AddPowerProtectSolution=(data)=>server.post(`/PowerProtect/AddPowerProtectSolution`,data)
    static GetPowerProtectSolution=(data)=>server.get(`PowerProtect/GetPowerProtectSolution?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&conditional=${data.conditional}`)
    static DeletePowerProtectSolution=(id)=>server.delete(`PowerProtect/DeletePowerProtectSolution?powerProtectId=${id}`)
    static UpdatePowerProtectSolution=(data)=>server.post(`/PowerProtect/UpdatePowerProtectSolution`,data)
    static GetPowerProtectSolutionList=(id)=>server.get(`PowerProtect/GetPowerProtectSolutionList?projectId=${id}`)
}
//客户管理
export class Customer {
    static GetNotBindCustomerDevice = (data) => server.get(`/Customer/GetNotBindCustomerDevice?projectId=${data.projectId}&conditional=${data.conditional}`)  //未绑定客户的设备（新增设备查询电表或水表等）
    static GetNotBindCustomerDeviceByPage = (data) => server.post(`/Customer/GetNotBindCustomerDeviceByPage?projectId=${data.projectId}&meterType=${data.meterType}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)  //未绑定客户的设备（新增设备查询电表或水表等）
    static GetPropertySolutionList = (id) => server.get(`/Customer/GetPropertySolutionList?projectId=${id}`)  //查询物业方案列表
    static GetAlarmSolutionList = (id) => server.get(`/Customer/GetAlarmSolutionList?projectId=${id}`)  //查询报警方案列表
    static GetPriceSolutionList = (data) => server.get(`/Customer/GetPriceSolutionList?projectId=${data.projectId}&solutionType=${data.solutionType}`)  //查询定价方案列表
    static AddCustomer = (data) => server.post(`/Customer/AddCustomer`, data)  //新增客户
    static UpdateCustomer = (data) => server.post(`/Customer/UpdateCustomer`, data)  //编辑客户
    static DeleteCustomer=(id)=>server.delete(`Customer/DeleteCustomer?customerId=${id}`)   //删除客户
    static GetCustomers = (data) => server.post(`/Customer/GetCustomers`, data)  //查询客户信息
    static GetCustomerList = (id) => server.get(`/Customer/GetCustomerList?projectId=${id}`)  //查询客户列表
    static UpdateEnableCustomer = (data) => server.get(`/Customer/UpdateEnableCustomer?customerId=${data.customerId}&enabled=${data.enabled}`)  //启停用客户
    static GetReplaceCustomerDevicies = (data) => server.post(`/Customer/GetReplaceCustomerDevicies?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)  //查询更换设备的信息
    static ReplaceCustomerDevicies = (data) => server.post(`/Customer/ReplaceCustomerDevicies`, data)  //客户更换设备
    static AddCustomerDevicies = (data) => server.post(`/Customer/AddCustomerDevicies`, data)  //客户新增设备
    static UnboundCustomerDevicies=(data)=>server.post(`Customer/UnboundCustomerDevicies?customerId=${data.customerId}&deviceId=${data.deviceId}&E=${data.E}&E1=${data.E1}&E2=${data.E2}&E3=${data.E3}&E4=${data.E4}`)   //客户解绑设备
    static GetPriceBySolutionId=(solutionId)=>server.get(`Customer/GetPriceBySolutionId?solutionId=${solutionId}`)//查询价格
    static GetDeviceReadings = (deviceId) => server.get(`/Customer/GetDeviceReadings?deviceId=${deviceId}`)  //系统获取表的尖峰平谷值
    static GetCustomerSingle=(id)=>server.get(`Customer/GetCustomerSingle?id=${id}`)   //查询客户信息
}
//后台管理
export class Backstage {   
    //区域 
    static GetProjectRegionList = (id) => server.get(`Backstage/GetProjectRegionList?projectId=${id}`) //查询区域列表
    static AddProjectRegion=(data)=>server.post(`/Backstage/AddProjectRegion`,data) //新增区域
    static GetProjectRegions=(data)=>server.get(`/Backstage/GetProjectRegions`,{params:data})//查询区域
    static DeleteProjectRegion=(id)=>server.delete(`/Backstage/DeleteProjectRegion?projectRegionId=${id}`) //删除区域
    static UpdateProjectRegion=(data)=>server.post(`/Backstage/UpdateProjectRegion`,data) //编辑区域
    static AddProjectBuilding=(data)=>server.post(`/Backstage/AddProjectBuilding`,data)//新增建筑
    static GetProjectBuilding=(data)=>server.get(`/Backstage/GetProjectBuilding`,{params:data}) //查询建筑
    static DeleteProjectBuilding=(id)=>server.delete(`/Backstage/DeleteProjectBuilding?projectBuildingId=${id}`) //删除建筑
    static UpdateProjectBuilding=(data)=>server.post(`/Backstage/UpdateProjectBuilding`,data) //编辑建筑
    static GetProjectBuildingList=(data)=>server.get(`/Backstage/GetProjectBuildingList?projectId=${data.projectId}&regionId=${data.regionId}`)
    static AddProjectFloor=(data)=>server.post(`Backstage/AddProjectFloor`,data)//添加楼层
    static GetProjectFloorList=(data)=>server.get(`/Backstage/GetProjectFloorList?buildingId=${data.buildingId}&projectId=${data.projectId}`)//查询楼层列表
    static GetProjectFloor=(data)=>server.get(`/Backstage/GetProjectFloor`,{params:data}) //查询楼层数据
    static UpdateProjectFloor=(data)=>server.post(`/Backstage/UpdateProjectFloor`,data)//编辑楼层
    static DeleteProjectFloor=(id)=>server.delete(`/Backstage/DeleteProjectFloor?projectFloorId=${id}`)//删除楼层
    static AddProjectRoom=(data)=>server.post(`/Backstage/AddProjectRoom`,data)//新增房间信息
    static GetProjectRoomList=(data)=>server.get(`/Backstage/GetProjectRoomList?floorId=${data.floorId}&projectId=${data.projectId}`)//查询房间列表
    static GetProjectRoom=(data)=>server.get(`/Backstage/GetProjectRoom`,{params:data})//查询房间信息
    static UpdateProjectRoom=(data)=>server.post(`/Backstage/UpdateProjectRoom`,data)//编辑房间信息
    static DeleteProjectRoom=(id)=>server.delete(`/Backstage/DeleteProjectRoom?projectRoomId=${id}`)//删除房间
    static GetProjectEnergyCategory=(data)=>server.get(`/Backstage/GetProjectEnergyCategory?projectId=${data.projectId}&meterType=${data.meterType}`)//查询能耗
    static AddProjectEnergyCategory=(data)=>server.post(`/Backstage/AddProjectEnergyCategory`,data)//添加能耗
    static UpdateProjectEnergyCategory=(data)=>server.post(`/Backstage/UpdateProjectEnergyCategory`,data)//编辑能耗 
    static DeleteProjectEnergyCategory=(id)=>server.delete(`/Backstage/DeleteProjectEnergyCategory?energyCategoryId=${id}`)//删除能耗
    static UpdaceDeviceProjectEnergyCategory=(id,data)=>server.post(`/Backstage/UpdaceDeviceProjectEnergyCategory?projectId=${id}`,data)//修改设备能耗类别
    static AddProjectLine=(data)=>server.post(`/Backstage/AddProjectLine`,data)//添加进线
    static GetProjectLineNode=(id)=>server.get(`/Backstage/GetProjectLineNode?projectId=${id}`)//查询线路的树形结构
    static UpdateProjectLine=(data)=>server.post(`/Backstage/UpdateProjectLine`,data)//编辑进线
    static GetDeviceByProjectLine=(id,lineId)=>server.get(`/Backstage/GetDeviceByProjectLine?projectId=${id}&projectLineId=${lineId}`)//查询线路下的设备
    static DeleteProjectLine=(id)=>server.delete(`/Backstage/DeleteProjectLine?lineId=${id}`)//删除线路
    static UpdateDeviceProjectLine=(projectId,lineId,data)=>server.post(`/Backstage/UpdateDeviceProjectLine?projectId=${projectId}&lineId=${lineId}`,data)//配置线路
    static GetRBFRHierarchical=(id)=>server.post(`/Backstage/GetRBFRHierarchical?projectId=${id}`)//级联查询（区域建筑楼层房间）
}
//账单报表
export class AccountReport {
    static GetAccountTransactions = (data) => server.post(`AccountReport/GetAccountTransactions`,data)//查询账户交易
    static GetRefundInfo = (data) => server.post(`AccountReport/GetRefundInfo`,data)//查询退费处理
    static GetRefundProcessList=(data)=>server.get(`/AccountReport/GetRefundProcessList`,data)//查询退费流程列表
    static RefundApply=(data)=>server.post(`/AccountReport/RefundApply?customerOrderId=${data.customerOrderId}&refundFlag=${data.refundFlag}`)//同意/打回
    static RefundOperation=(data)=>server.post(`/AccountReport/RefundOperation?customerOrderId=${data.customerOrderId}&orderType=${data.orderType}&remark=${data.remark}`)//退费操作
}

//充值补助
export class RechargeSubsidy {
    static GetSubsidyInfo = (data) => server.post(`RechargeSubsidy/GetSubsidyInfo`,data)//查询补助信息
    static GetCustomers = (data) => server.post(`/RechargeSubsidy/GetCustomerInfo`, data)  //查询客户信息
    static ManualRecharge = (amount , projectId , data) => server.post(`/RechargeSubsidy/ManualRecharge?amount=${amount}&projectId=${projectId}`, data)  //查询客户信息
    static FileRecharge = (data) => server.post(`/RechargeSubsidy/FileRecharge`, data)  //文件充值
}

//设备管理
export class SettingManage {
    static FindAlike = (data) => server.get(`Meter/FindAlike?projectId=${data.projectId}&enableState=${data.enableState}&customerType=${data.customerType}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//表计模糊查询
    static GatewayFindAlike = (data) => server.get(`Gateway/FindAlike?projectId=${data.projectId}&enableState=${data.enableState}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//网关模糊查询
    // static GetCategorys = () => server.get(`Gateway/GetCategorys`)//网关型号列表-----原来接口，已被下面的接口替代
    static GetCategorys = (projectId) => server.get(`Gateway/GetCategorysInProject?project=${projectId}`)//网关型号列表
    static Add = (data) => server.post(`Gateway/Add`,data)//新增网关
    static Update = (data) => server.post(`Gateway/Update`,data)//编辑网关
    static Delete = (id) => server.delete(`Gateway/Delete?id=${id}`)//编辑网关
    static QueryAlarmPlans = (projectId) => server.get(`Meter/QueryAlarmPlans?projectId=${projectId}`)//获取项目下表计告警方案
    static DeQueryAlarmPlanItemslete = (planId) => server.get(`Meter/QueryAlarmPlanItems?planId=${planId}`)//获取告警方案子项
    static UpdateAlarmPlanItem = (data) => server.post(`Meter/UpdateAlarmPlanItem`,data)//修改告警方案子项
    // static GetMeterCategorys = (meterType) => server.get(`Meter/GetCategorys?meterType=${meterType}`)//获取设备型号-----原来接口，已被下面的接口替代
    static GetMeterCategorys = (meterType , projectId) => server.get(`Meter/GetCategorysInProject?meterType=${meterType}&project=${projectId}`)//获取设备型号
    static FindSimpleList = (projectId) => server.get(`Gateway/FindSimpleList?projectId=${projectId}`)//获取简易网关列表
    static MeterAdd = (data) => server.post(`Meter/Add` , data)//获取简易网关列表
    static MeterDelete = (id) => server.delete(`Meter/Delete?id=${id}`)//表计-删除
    static MeterUpdate = (data) => server.post(`Meter/Update` , data)//表计-修改
    static MeterImportChild = (data) => server.post(`Meter/ImportChild` , data)//表计-excel导入子设备
    static MeterImportDirect = (data) => server.post(`Meter/ImportDirect` , data)//表计-excel导入直连设备
}
//远程控制
export class Remote{
    static AllMeter=(data)=>server.get(`Remote/AllMeter?meterType=${data.meterType}&projectId=${data.projectId}&regionId=${data.regionId}&buildingId=${data.buildingId}&floorId=${data.floorId}&roomId=${data.roomId}&alike=${data.alike}&type=${data.type}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//查询设备
    static FindPowerProtect = (projectId) => server.get(`Remote/FindPowerProtect?projectId=${projectId}`)//获取保电方案简易列表
    static StartBatchValveTask = (data) => server.post(`Remote/StartBatchValveTask`,data)//发起批量抄读阀门状态任务
    static BatchValveResponse = (data) => server.post(`Remote/BatchValveResponse`,data)//查询批量抄读阀门状态结果
    static StartCalling = (data) => server.post(`Remote/StartCalling`,data)//发起批量抄读测点任务
    static CallingResponse = (data) => server.post(`Remote/CallingResponse`,data)//查询批量抄读测点结果
    static Open = (data) => server.post(`Remote/Open`,data)//批量分闸
    static OpenForce = (data) => server.post(`Remote/OpenForce`,data)//拉闸结算
    static Close = (data) => server.post(`Remote/Close`,data)//批量合闸
    static SetPowerProtect = (powerSolutionId,data) => server.post(`Remote/SetPowerProtect?powerSolutionId=${powerSolutionId}`,data)//设置保电方案
    static RemovePowerProtect = (data) => server.post(`Remote/RemovePowerProtect`,data)//取消保电方案
    static FindAlarmSolution = (projectId) => server.get(`Remote/FindAlarmSolution?projectId=${projectId}`)//获取报警方案简易列表
    static SetAlarmSolution = (alarmSolutionId,data) => server.post(`Remote/SetAlarmSolution?alarmSolutionId=${alarmSolutionId}`,data)//设置报警方案
    static RemoveAlarmSolution = (data) => server.post(`Remote/RemoveAlarmSolution`,data)//取消告警方案
    static Log = (data) => server.post(`Remote/Log`,data)//查询操作日志
    static BatchValveStatus = (data) => server.post(`Remote/BatchValveStatus`,data)//批量查询阀门当前状态
}
export const OpLog = (data) => server.post(`Remote/Log`,data)
//能源账户充值
export class EnergyAccount {
    static EnergyCharge = (data) => server.post(`EnergyAccount/EnergyCharge?projectId=${data.projectId}&customerId=${data.customerId}&amount=${data.amount}&payMode=${data.payMode}&code=${data.code}`)//能源账户充值
    static EnergyAccountRefund = (data) => server.post(`EnergyAccount/EnergyAccountRefund?customerId=${data.customerId}&orderType=${data.orderType}&amount=${data.amount}&remark=${data.remark}`)//能源账户退费
    static EnergyAccountSettlement = (data) => server.post(`EnergyAccount/EnergyAccountSettlement?customerId=${data.customerId}&remark=${data.remark}`)//能源账户结算
}
//物业账户充值
export class PropertyAccount {
    static PropertyCharge = (data) => server.post(`PropertyAccount/PropertyCharge?projectId=${data.projectId}&customerId=${data.customerId}&amount=${data.amount}&payMode=${data.payMode}&walletType=${data.walletType}&code=${data.code}`)//物业账户充值
    static PropertyAccountRefund = (data) => server.post(`PropertyAccount/PropertyAccountRefund?customerId=${data.customerId}&orderType=${data.orderType}&amount=${data.amount}&remark=${data.remark}`)//物业账户退费
    static PropertyAccountSettlement = (customerId) => server.post(`EnergyAccount/PropertyAccountSettlement?customerId=${customerId}`)//物业账户结算
}
//通知告警
export class Warning {
    static FindAlikeDevice = (data) => server.get(`Alarm/FindAlikeDevice?projectId=${data.projectId}&region=${data.region}&building=${data.building}&floor=${data.floor}&room=${data.room}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&alike=${data.alike}`)//设备告警
    static FindAlikeAccount = (data) => server.get(`Alarm/FindAlikeAccount?projectId=${data.projectId}&region=${data.region}&building=${data.building}&floor=${data.floor}&room=${data.room}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&alike=${data.alike}`)//账号余额告警
    static FindRecord = (data) => server.get(`Alarm/FindRecord?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//告警消息推送
}

//系统日志
export class SystemLog {
    static SystemLogQueryPage = (data) => server.get(`SystemLog/QueryPage?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//查询系统日志
    static SystemLogDetail = (id) => server.get(`SystemLog/Query?id=${id}`)//查询系统日志详情
}

//手动抄表
export class Mannul {
    static GetRecords = (data) => server.get(`ManualMeterReading/GetRecords?projectId=${data.projectId}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`)//插叙手插记录
    static GetCustomers = (data) => server.get(`ManualMeterReading/GetCustomers?projectId=${data.projectId}&alike=${data.alike}`)//查询客户 
    static GetDevices = (data) => server.get(`ManualMeterReading/GetDevices?projectId=${data.projectId}&customerId=${data.customerId}`)//查询设备
    static SetManual = (data) => server.post(`ManualMeterReading/SetManual`,data)//写入抄表记录
}

//客户报告
export class UserReportApi {
    static GetUserReport = (data) => server.get(`CustomerReport/GetUserReport?projectId=${data.projectId}&date=${data.date}&yearMonth=${data.yearMonth}`)//查询客户报告
}
export const GetCamerasVideosByProjectId = (Id) =>server.get(`/Camera/GetCamerasByHouseId?houseId=${Id}`)


export const leftControl = (params, url, ip, channel, user, pwd) => server.post('http://'+ url +'/V1/Ptz/PtzLeft?ip='+ ip +'&channel=' + channel + '&user='+ user +'&pwd=' + pwd, params)
export const bottomControl = (params, url, ip, channel, user, pwd) => server.post('http://'+ url +'/V1/Ptz/PtzDown?ip='+ ip +'&channel=' + channel + '&user='+ user +'&pwd=' + pwd, params)
export const rightControl = (params, url, ip, channel, user, pwd) => server.post('http://'+ url +'/V1/Ptz/PtzRight?ip='+ ip +'&channel=' + channel + '&user='+ user +'&pwd=' + pwd, params)
export const topControl = (params, url, ip, channel, user, pwd) => server.post('http://'+ url +'/V1/Ptz/PtzUp?ip='+ ip +'&channel=' + channel + '&user='+ user +'&pwd=' + pwd, params)
export const stopControl = (params, url, ip, channel, user, pwd) => server.post('http://'+ url +'/V1/Ptz/PtzStop?ip='+ ip +'&channel=' + channel + '&user='+ user +'&pwd=' + pwd, params)

//运行监控
export const Monitoring =  {
    DeviceTypeManager:{
        GatewayCategory:(data)=>server.get(`/Monitor/GatewayCategory/QueryByPage?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`), //获取网关列表
        AllDeviceStyle:()=>server.get('/Monitor/DeviceCategory/AllDeviceStyle'),//获取设备类型
        AddCategory:(data)=>server.post('/Monitor/GatewayCategory/AddCategory',data),//新增网管类型
        QueryNotUsed:(id)=>server.get('/Monitor/GatewayCategory/QueryNotUsed?projectId='+id),//查询未使用的网关类型
        UpdateCategory:(data)=>server.post('/Monitor/GatewayCategory/UpdateCategory',data),//更新网关设备类型
        DeleteCategory:(data)=>server.delete(`/Monitor/GatewayCategory/Delete?projectId=${data.projectId}&category=${data.category}`),//删除网关设备
        DeviceQueryNotUsed:(data)=>server.get(`/Monitor/DeviceCategory/QueryNotUsed?projectId=${data.projectId}&deviceStyle=${data.deviceStyle}`),//获取未使用电表
        DeviceQueryCategoryFull:(data)=>server.get(`/Monitor/DeviceCategory/QueryCategoryFull?projectId=${data.projectId}&category=${data.category}`) //获取对应电表的详细信息
    }
  
}