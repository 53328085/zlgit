import { data } from "browserslist";
import server from "./index";
// 测试 新技术
export class Test {
  static User = (params) => server.post(`/users`, params);
}
// zl api start
// 登录



export class Login {
  static SystemConfig = (url) =>
    server.get(`/General/SystemConfig/GetSystemConfigInfo?url=${url}`);
  static LoginByName = (data = {}) =>
    server.post(`/General/User/LoginByName?name=${data.name}&pwd=${data.pwd}&key=${data.key}&code=${data.code}`); // 根据用户名登录
 
  static GetVerification = (mobile) =>
    server.post(`/General/User/GetCode?mobile=${mobile}`); // 获取验证吗
  static LoginByPhone = (data = {}) =>
    server.post(`/General/User/LoginByCode?mobile=${data.mobile}&code=${data.code}`); // 根据手机号登录
  static GetMenuByRoleType = (params = {}) =>
    server.get("/Project/GetMenuByRoleType", { params }); // 根据登录人查询项目和侧边栏
  static SystemQueryLoginConfigInfo = (data = {}) =>
    server.get("/System/QueryLoginConfigInfo", data); // 查询登录页配置
  static UpdateCurrentAccount = ({ mobile, pwd, oldPwd }) =>
    server.post(
      `/General/User/ResetLoginPersonPassword?mobile=${mobile}&pwd=${pwd}&oldPwd=${oldPwd}`
    );
  static LoginOut = () => server.post("User/Logout");
  static GetUseMenus = (projectId, userId) =>
    server.get(`/User/GetUseMenus?projectId=${projectId}&userId=${userId}`);
  static GetCode = () =>
    server.get(`/General/User/CreateCode`);
}
 
// 项目列表
export class ProjectList {
  static queryProject = ({ pageNum, pageSize, name = "", state = 0 } = {}) =>
    server.get(
      `/General/PlatConfig/QueryProjects?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}&state=${state}`
    );
  static createProject = (data) =>
    server.post("/General/PlatConfig/CreateProject", data); // 新增项目
  static QueryMenus = (projectId) =>
    server.get(`/General/User/QueryMenus?projectId=${projectId}`); // 查询菜单栏
 
  // /General/ProjectSetting/QueryProjectLog?pageNum=2&pageSize=1'
  static QueryProjectLog = ({pageNum, pageSize, start, end}) =>
  server.get(`/General/ProjectSetting/QueryProjectLog?start=${start}&end=${end}&pageNum=${pageNum}&pageSize=${pageSize}`); // 查询操作记录
}
// 公共模块---项目设置--- 项目基础设置,  项目发布
export class ProjectSetting {
  static QueryProjectInfo = (projectId) => server.get(`/General/ProjectSetting/QueryProjectInfo?projectId=${projectId}`) //  查询项目信息
  static SaveProjectInfo = (params) => server.post(`/General/ProjectSetting/SaveProjectInfo`, params) //  保存项目信息
  static queryProjectPublishInfo = (projectId) => server.get(`/General/ProjectSetting/QueryProjectPublishInfo?projectId=${projectId}`) // 查询项目发布信息
  static publishProject = ({ projectId, state, code, moble }) => server.post(`/General/ProjectSetting/PublishProject?projectId=${projectId}&state=${state}&code=${code}&moble=${moble}`)//  项目发布/取消发布
  static DeleteProject = (projectId, mobile, code) => server.post(`/General/ProjectSetting/DeleteProject?projectId=${projectId}&mobile=${mobile}&code=${code}`) //  删除项目
}
// 公共模块---项目设置---区域设置
export class AreaSetting {
  static QueryAreaLevels = (projectId) =>
    server.get(
      `/General/ProjectSetting/QueryAreaLevels?projectId=${projectId}`
    ); //  查询区域
  static InsertAreaLevel = ({ projectId, level, name, type }) =>
    server.post(
      `/General/ProjectSetting/InsertAreaLevel?projectId=${projectId}&level=${level}&name=${name}&type=${type}`
    ); //  插入区域
  static DeleteAreaLevel = ({ projectId, level }) =>
    server.delete(
      `/General/ProjectSetting/DeleteAreaLevel?projectId=${projectId}&level=${level}`
    ); //  删除区域
  static UpdateAreaLevel = ({ projectId, level, name, type }) =>
    server.post(
      `/General/ProjectSetting/UpdateAreaLevel?projectId=${projectId}&level=${level}&name=${name}&type=${type}`
    ); //  修改区域
  static QueryAreaLevelFields = ({ projectId, level }) =>
    server.get(
      `/General/ProjectSetting/QueryAreaLevelFields?projectId=${projectId}&level=${level}`
    ); //  查询字段
  static InsertAreaLevelField = ({ projectId, level, name, type }) =>
    server.post(
      `/General/ProjectSetting/InsertAreaLevelField?projectId=${projectId}&level=${level}&name=${name}&type=${type}`
    ); //  新增字段
  static DeleteAreaLevelField = ({ projectId, fieldId }) =>
    server.delete(
      `/General/ProjectSetting/DeleteAreaLevelField?projectId=${projectId}&fieldId=${fieldId}`
    ); // 删除字段
  static QueryAllArea = (projectId, level) =>
    server.get(`/General/Area/QueryAll?projectId=${projectId}&level=${level}`); //查询全部区域
}
// 公共模块---项目设置---数据组设置
export class DataGroups {
  static QueryDataGroups = () =>
    server.get(`/General/ProjectSetting/QueryDataGroups`); //  查询数据组名称
  static InsertDataGroup = ({ name }) =>
    server.post(`/General/ProjectSetting/InsertDataGroup?name=${name}`); //  新增数据组名称
  static DeleteDataGroup = ({ id }) =>
    server.post(`/General/ProjectSetting/DeleteDataGroup?id=${id}`); //  删除数据组
  static UpdateDataGroup = ({ id, name }) =>
    server.post(
      `/General/ProjectSetting/UpdateDataGroup?id=${id}&name=${name}`
    ); //  编辑数据组
}
// 公共模块---用户管理
export class User {
  // --账号管理
  static QueryOperationManager = ({ alike, pageNum, pageSize }) =>
    server.get(
      `/General/User/QueryOperationManager?alike=${alike}&pageNum=${pageNum}&pageSize=${pageSize}`
    ); //  查询账号
  static AddOperationManager = (params) =>
    server.post(`/General/User/AddOperationManager`, params); //  新增
  static DeleteAccount = (id) => server.post(`/General/User/Delete?id=${id}`); //  删除
  static ResetPassword = ({ id, pwd }) =>
    server.post(`/General/User/ResetPassword?id=${id}&pwd=${pwd}`); //  重置密码
  static Update = (params) => server.post(`/General/User/Update`, params); // 编辑
  // -- 权限管理
  static QueryOperationManagers = ({ projectId }) =>
    server.get(`/General/User/QueryOperationManagers?projectId=${projectId}`); // 查询 运营管理员 已选择
  static InsertOperationManager = ({ projectId, userId }) =>
    server.post(
      `/General/User/InsertOperationManager?projectId=${projectId}&userId=${userId}`
    ); // 添加 运营管理员
  static DeleteOperationManager = ({ projectId, userId }) =>
    server.post(
      `/General/User/DeleteOperationManager?projectId=${projectId}&userId=${userId}`
    ); // 删除 运营管理员
  static QueryProjectManager = (projectId) =>
    server.get(`/General/User/QueryProjectManager?projectId=${projectId}`); // 查询项目管理员
  static AddProjectManager = (params) =>
    server.post(`/General/User/AddProjectManager`, params); // 新增项目管理员
  static DeleteProjectManager = ({ userId }) =>
    server.post(`/General/User/DeleteProjectManager?userId=${userId}`); // 删除项目管理员
 
  static QueryProjectMaintenance = ({ projectId }) =>
    server.get(`/General/User/QueryProjectMaintenance?projectId=${projectId}`); // 查询运维人员
 
  static InsertProjectMaintenance = (params) =>
    server.post(`/General/User/InsertProjectMaintenance`, params); // 添加运维人员
 
  static DeleteProjectMaintenance = ({ userId }) =>
    server.post(`/General/User/DeleteProjectMaintenance?userId=${userId}`); // 删除运维人员
 
  static QueryUserMenus = ({ projectId, userId }, params) =>
    server.get(
      `/General/User/QueryUserMenus?projectId=${projectId}&userId=${userId}`
    ); // 查询用户菜单栏
 
  static SetMenus = ({ projectId, userId }, params) =>
    server.post(
      `/General/User/SetMenus?projectId=${projectId}&userId=${userId}`,
      params
    ); // 查询菜单栏
 
  static GetDataRights = ({ projectId, userId }, params) =>
    server.post(
      `/General/User/GetDataRights?projectId=${projectId}&userId=${userId}`,
      params
    ); // 查询数据权限
  ///V1/General/User/SetDataRightsArea
  static SetDataRightsarea = ({ projectId, userId }, params) =>
    server.post(
      `/General/User/SetDataRightsArea?projectId=${projectId}&userId=${userId}`,
      params
    ); // 设置园区权限
  static SetDataRightsenergy = ({ projectId, userId }, params) =>
    server.post(
      `/General/User/SetDataRightsEnergy?projectId=${projectId}&userId=${userId}`,
      params
    ); // 设置能耗权限
  static SetDataRightsdevice = ({ projectId, userId }, params) =>
    server.post(
      `/General/User/SetDataRightsDevice?projectId=${projectId}&userId=${userId}`,
      params
    ); // 设置设备权限
}
 
// 公共模块---区域管理
export class Area {
  static AllLevel = (projectId) =>
    server.get(`/General/Area/AllLevel?projectId=${projectId}`);
 
  static QueryByPage = ({
    projectId,
    level,
    topAreaId,
    name,
    pageNum,
    pageSize,
  }) =>
    server.get(
      `/General/Area/QueryByPage?projectId=${projectId}&level=${level}&topAreaId=${topAreaId}&name=${name}&pageNum=${pageNum}&pageSize=${pageSize}`
    ); // 查询菜单栏
 
  static Insert = (params) => server.post(`/General/Area/Insert`, params);
 
  static DeleteArea = ({ projectId, areaId }) =>
    server.delete(
      `/General/Area/DeleteArea?projectId=${projectId}&areaId=${areaId}`
    );
  static UpdateArea = (params) =>
    server.post(`/General/Area/UpdateArea`, params);
  static QueryAll = ({ projectId, level, parentId }) =>
    server.get(
      `/General/Area/QueryAll?projectId=${projectId}&level=${level}&parentId=${parentId}`
    );
  static QueryUsedMeter = ({ projectId, type, areaId, alike = "" } = {}) =>
    server.get(
      `/General/Area/QueryUsedMeter?projectId=${projectId}&type=${type}&areaId=${areaId}&alike=${alike}`
    );
 
  static QueryUnusedMeter = ({ projectId, type, areaId, alike = "" } = {}) =>
    server.get(
      `/General/Area/QueryUnusedMeter?projectId=${projectId}&type=${type}&areaId=${areaId}&alike=${alike}`
    );
  static ConfigureMeter = (params = {}) =>
    server.post(`/General/Area/ConfigureMeter`, params);
 
    static AddSummaryDevice = (projectId, areaId, params) =>
    server.post(`/General/Area/AddSummaryDevice?projectId=${projectId}&areaId=${areaId}`, params); // 添加区域总表
 
  static RemoveSummaryDevice = (projectId, areaId, params) =>
    server.post(`/General/Area/RemoveSummaryDevice?projectId=${projectId}&areaId=${areaId}`, params); // 移除区域总表
  
  static AddSubDevice = (projectId, areaId, params) =>
    server.post(`/General/Area/AddSubDevice?projectId=${projectId}&areaId=${areaId}`, params); // 添加区域分表
 
  static RemoveSubDevice = (projectId, areaId, params) =>
    server.post(`/General/Area/RemoveSubDevice?projectId=${projectId}&areaId=${areaId}`, params); // 移除区域分表  
  ///V1/General/Area/QueryUnusedMeter
}

// 公共模块---数据大屏

  export class BigScreen {
    static QueryBigScreen = (projectId) => server.get(`/General/BigScreen/Query?projectId=${projectId}`) 
    static SetBigScreen = (projectId, params={}) => server.post(`/General/BigScreen/Set?projectId=${projectId}`, params)
  }

// 能源管理--重点设备 -- 运行态
export class QueryElectric {
  static query = ({projectId, type,date, pageNum, pageSize, areaId}) =>
    server.post(
      `Energy/EnergyImportantRuntime/QueryElectric?projectId=${projectId}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`
      
    );
}

// 能源管理--重点设备 -- 设计态
export class DesElectric {
      
  static queryDrive = ({projectId,areaId}) => // 查询重点设备列表
    server.get(
      `Energy/EnergyImportantDesigner/QueryImportmantDevices?projectId=${projectId}&areaId=${areaId}` 
    );
    static insertDrive = ({projectId,name, areaId}) => // 添加重点设备
    server.post(
      `Energy/EnergyImportantDesigner/InsertImportmantDevice?projectId=${projectId}&name=${name}&areaId=${areaId}` 
    );  
    static updateDrive = ({projectId,name, id}) => // 更新重点设备
    server.post(
      `Energy/EnergyImportantDesigner/UpdateImportmantDevice?projectId=${projectId}&id=${id}&name=${name}` 
    );  

    static deleteDrive = ({projectId,id}) => // 删除重点设备
    server.delete(
      `Energy/EnergyImportantDesigner/DeleteImportmantDevices?projectId=${projectId}&id=${id}` 
    ); 
    static queryDriveConfig = ({projectId,id, areaId}) => // 查询重点设备配置表计
    server.get(
      `Energy/EnergyImportantDesigner/QueryImportmantDeviceConfiged?projectId=${projectId}&importantDeviceId=${id}&areaId=${areaId}` 
    );  

    static queryDriveUnconfig = ({projectId,id, areaId}) => // 查询重点设备未配置表计
    server.get(
      `Energy/EnergyImportantDesigner/QueryImportmantDeviceNoConfiged?projectId=${projectId}&importantDeviceId=${id}&areaId=${areaId}` 
    );  

    static conifgDrive = ({projectId,id}, params) => // 配置重点设备
    server.post(
      `Energy/EnergyImportantDesigner/ConfigImportmantDeviceSns?projectId=${projectId}&importantDeviceId=${id}`, params
    );  


}


// 能源管理--能源概述
export class EnergyOverView {
  static EnergyOverViewRuntime = (projectId, params) =>
    server.post(
      `/Energy/EnergyOverViewRuntime/QueryElectricOverview?projectId=${projectId}`,
      params
    );
}
// 能源管理--区域能耗
export class EnergyArea {
  static QueryEnergyAreaDay = ({projectId, meterType, date, areaId, type}, params) =>  // 日
    server.post(
      `Energy/EnergyAreaRuntime/QueryEnergyArea_Day?projectId=${projectId}&meterType=${meterType}&date=${date}&areaId=${areaId}&type=${type}`, params
    );
 static QueryEnergyAreaMonth = ({projectId, meterType, date, areaId, type}, params) =>  // 月
    server.post(
      `Energy/EnergyAreaRuntime/QueryEnergyArea_Month?projectId=${projectId}&meterType=${meterType}&date=${date}&areaId=${areaId}&type=${type}`, params
    );
  static QueryEnergyAreaYear= ({projectId, meterType, date, areaId, type},params) =>  // 年
    server.post(
      `Energy/EnergyAreaRuntime/QueryEnergyArea_Year?projectId=${projectId}&meterType=${meterType}&date=${date}&areaId=${areaId}&type=${type}`, params
    );
}

 
// 能源管理--园区能耗
export class EnergyComprehensive {
  // 能耗
  static QueryOverview = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryOverview?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)// 综合能耗
  static QueryElectric = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryElectric?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
  static QueryWaterCold = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryWaterCold?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
  static QueryWaterHot = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryWaterHot?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
  static QuerySteam = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QuerySteam?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params) // 蒸汽
  static QueryGas = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryGas?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
  static QueryCoal = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryCoal?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
  static QueryOil = ({ projectId, type, date, shiftNo } = {}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryOil?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
 
    // 费用
    static QueryOverviewCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryOverviewCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)// 综合能耗
    static QueryElectricCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryElectricCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
    static QueryWaterColdCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryWaterColdCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
    static QueryWaterHotCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryWaterHotCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
    static QuerySteamCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QuerySteamCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params) // 蒸汽
    static QueryGasCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryGasCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
    static QueryCoalCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryCoalCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
    static QueryOilCost = ({projectId, type, date, shiftNo}={}, params) => server.post(`/Energy/EnergyComprehensiveRuntime/QueryOilCost?projectId=${projectId}&type=${type}&date=${date}&shiftNo=${shiftNo}`, params)
   
  }
  // 储能管理-- 储能控制
  export class StorageControlRuntime {
 
 
   // /Storage/StorageControlRuntime/QueryPcsList?projectId=2&areaId=2
    static QueryPcsList = (projectId, areaId) => server.get(`/Storage/StorageControlRuntime/QueryPcsList?projectId=${projectId}&areaId=${areaId}&status=${status}`);
 
 
   
    static UpdateSystemStatus = (projectId, areaId, status) => server.get(`/Storage/StorageControlRuntime/UpdateSystemStatus?projectId=${projectId}&areaId=${areaId}&status=${status}`);
 
    static UpdateHandModeStatus = (projectId, areaId, status) => server.get(`/Storage/StorageControlRuntime/UpdateHandModeStatus?projectId=${projectId}&areaId=${areaId}&status=${status}`);
    // /Storage/StorageControlRuntime/UpdateHandModeStatus?projectId=2&pcsId=2&status=2
    static QueryStorageControlInfo = (projectId, areaId, pcsId) => server.get(`/Storage/StorageControlRuntime/QueryStorageControlInfo?projectId=${projectId}&areaId=${areaId}&pcsId=${pcsId}`);
    static QueryStrategyList = (projectId, areaId) => server.get(`/Storage/StorageControlRuntime/QueryStrategyList?projectId=${projectId}&areaId=${areaId}`);
 
    static QueryStrategyDetail = (projectId, StrategyId) => server.get(`/Storage/StorageControlRuntime/QueryStrategyDetail?projectId=${projectId}&StrategyId=${StrategyId}`);
    static DeleteRuntimePlan = (projectId, planId) => server.delete(`/Storage/StorageControlRuntime/DeleteRuntimePlan?projectId=${projectId}&planId=${planId}`);
    
 
 
  
    static AddRuntimePlan = (projectId, params) => server.post(`/Storage/StorageControlRuntime/AddRuntimePlan?projectId=${projectId}`, params);
 
    static UpdateRuntimePlan = (projectId, params) => server.post(`/Storage/StorageControlRuntime/UpdateRuntimePlan?projectId=${projectId}`, params);
 
    static QuerySiteStatus = (projectId, areaId) => server.get(`/Storage/StorageControlRuntime/QuerySiteStatus?projectId=${projectId}&areaId=${areaId}`);
   // static UpdateHandModeStatus = (projectId, areaId, status) => server.get(`/Storage/StorageControlRuntime/UpdateHandModeStatus?projectId=${projectId}&areaId=${areaId}&status=${status}`); // 1: 开机, 2： 关机
    
    
     
   
    static QuerySiteDateAndMode = (projectId, areaId, p) => server.get(`/Storage/StorageControlRuntime/QuerySiteRuntimeDateAndMode?projectId=${projectId}&areaId=${areaId}`); 
    static UpdateP = (projectId, areaId, p) => server.get(`/Storage/StorageControlRuntime/UpdateP?projectId=${projectId}&areaId=${areaId}&p=${p}`); 
  
    static UpdateQ = (projectId, areaId, q) => server.get(`/Storage/StorageControlRuntime/UpdateQ?projectId=${projectId}&areaId=${areaId}&q=${q}`); 
  }
 
 // 储能管理-- 能耗统计
  export class ConsumeStatisticsRuntime {
    static QueryIncome = (projectId, stationName) => server.get(`/Storage/ConsumeStatisticsRuntime/QueryIncome/?projectId=${projectId}&stationName=${stationName}`); // 日 月 年 收入
    static QueryIncomeTrends = (projectId,  type, date, stationName) => server.get(`/Storage/ConsumeStatisticsRuntime/QueryIncomeTrends/?projectId=${projectId}&type=${type}&date=${date}&stationName=${stationName}`); // 收益趋势
    static QueryDisChargeETrends = (projectId,type, date, stationName) => server.get(`/Storage/ConsumeStatisticsRuntime/QueryDisChargeETrends/?projectId=${projectId}&type=${type}&date=${date}&stationName=${stationName}`); // 充放电趋势
  }
 
// 储能管理--报表统计
export class StorageReportRuntime {
  static QueryPrice = (projectId, areaId) => server.get(`/Storage/StorageReportRuntime/QueryPrice?projectId=${projectId}&areaId=${areaId}`);
  static QueryReports = (params={}, areaId) => server.post(`/Storage/StorageReportRuntime/QueryReports?areaId=${areaId}`, params);
}
// 储能管理--告警信息
/* export class StorageAlarmruntime {
 static AlarmStatistics = (projectId, areaId) => server.get(`/Storage/StorageAlarmRuntime/AlarmStatistics?projectId=${projectId}&areaId=${areaId}`);
  static QueryStorageAlarmByPage = (params={}) => server.post(`/Storage/StorageAlarmRuntime/QueryStorageAlarmByPage`, params);
} */
 
// 储能管理--充放订单
export class StorageOrderRuntime {
  static QueryRuntimeStatus = () => server.get(`/Storage/StorageOrderRuntime/QueryRuntimeStatus`);
  static QueryType = () => server.get(`/Storage/StorageOrderRuntime/QueryType`);
  static QueryStorageOrders = (areaId,status,type, params) => server.post(`/Storage/StorageOrderRuntime/QueryStorageOrders?areaId=${areaId}&runtimeStatus=${status}&type=${type}`, params);
}
 
// 储能管理--运行报告
 
export class StorageRunReport {
  static QueryRuntimeStatus = (projectId, type, date) => server.get(`/Storage/StorageRunReport/QueryRunReport/?projectId=${projectId}&type=${type}&date=${date}`);
 
}
 
// 储能管理--操作日志
 
export class OperationLogRuntime {
  static QueryLogsByPage = (params) => server.post(`/Solar/OperationLogRuntime/QueryLogsByPage`, params);
 
}

// 储能管理设置--参数设置
export class StorageParameterSetupDesigner {
  static QuerySetup = (projectId, areaId) => server.get(`/Storage/StorageParameterSetupDesigner/QuerySetup?projectId=${projectId}&areaId=${areaId}`);
  static Setup = ({projectId, params}={}) => server.post(`/Storage/StorageParameterSetupDesigner/Setup?projectId=${projectId}`, params);
  
}
 
// 储能管理设置--自动模式管理
 
export class StorageAutoModeDesigner {
  static QueryRuntimePlan = (projectId, areaId) => server.get(`/Storage/StorageAutoModeDesigner/QueryRuntimePlan?projectId=${projectId}&areaId=${areaId}`);
  static QueryStrategyDetail = (projectId, StrategyId) => server.get(`/Storage/StorageAutoModeDesigner/QueryStrategyDetail?projectId=${projectId}&StrategyId=${StrategyId}`);
  static DeleteRuntimePlan = (projectId, planId) => server.delete(`/Storage/StorageAutoModeDesigner/DeleteRuntimePlan?projectId=${projectId}&planId=${planId}`);
  static QueryStrategyList = (projectId, areaId) => server.get(`/Storage/StorageAutoModeDesigner/QueryStrategyList?projectId=${projectId}&areaId=${areaId}`);
 
 
 
  static AddRuntimePlan = (projectId, params) => server.post(`/Storage/StorageAutoModeDesigner/AddRuntimePlan?projectId=${projectId}`, params);
 
  static UpdateRuntimePlan = (projectId, params) => server.post(`/Storage/StorageAutoModeDesigner/UpdateRuntimePlan?projectId=${projectId}`, params);
 
  static UpdateEnable = (projectId, areaId, planId, status) => server.get(`/Storage/StorageAutoModeDesigner/UpdateEnable?projectId=${projectId}&areaId=${areaId}&planId=${planId}&status=${status}`);
  
}
// 储能管理设置--储能柜管理
 
export class StorageContainerDesigner {
  static GetContainers = ({projectId, areaId=0, siteId=0, pageNum, pageSize}={}) => server.get(`/Storage/StorageContainerDesigner/GetContainers?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}&pageNum=${pageNum}&pageSize=${pageSize}`);
 
  static FindContainerList = ( projectId, areaId, siteId ) => server.get(`/Storage/StorageContainerDesigner/FindContainerList?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
 
  static AddContainer = (projectId, params) => server.post(`/Storage/StorageContainerDesigner/AddContainer?projectId=${projectId}`, params);
 
  static UpdateContainer = (projectId, params) => server.post(`/Storage/StorageContainerDesigner/UpdateContainer?projectId=${projectId}`, params);
 
  // /StorageContainerDesigner/DeleteContainer?projectId=2&id=2'
 
  static DeleteContainer = (projectId, id) => server.delete(`/Storage/StorageContainerDesigner/DeleteContainer?projectId=${projectId}&id=${id}`);
}
 
export class RuntimeHMI {
   static onHerart = (params) => server.post(`/Monitor/RuntimeHMI/OnHeart`, params); //  定时请求

   static onStop = (channel) => server.get(`/Monitor/RuntimeHMI/OnStop?channel=${channel}`); //  定时请求
}

// 结算收费--结算设置
export class PrepayConfig {
  static QueryPrepayServerUrl = (projectId) => server.get(`Energy/PrepayConfig/QueryPrepayServerUrl?projectId=${projectId}` ); //  获取预付费URL

  static SaveUrl = ({projectId, url}) => server.post(`Energy/PrepayConfig/SaveUrl?projectId=${projectId}&url=${url}`); //  保存预付费URL
  static QueryUsers = (projectId) => server.get(`Energy/PrepayConfig/QueryUsers?projectId=${projectId}`); // 查询用户列表
  static SavePreapyUser = ({projectId, userId, prepayUserName, prepayPassword, enabled}) => server.post(`Energy/PrepayConfig/SavePreapyUser?projectId=${projectId}&userId=${userId}&prepayUserName=${prepayUserName}&prepayPassword=${prepayPassword}&enabled=${enabled}`); // 保存用户信息
  
  static DeletePreapyUser = ({projectId, userId}) => server.post(`Energy/PrepayConfig/DeletePreapyUser?projectId=${projectId}&userId=${userId}`); // 删除用户信息
}
// 结算收费--概述
export class PrepayRun{
  static GetPrepayUserInfo = (energyProjectId) => server.get(`Energy/SettlementOverview/GetPrepayUserInfo?energyProjectId=${energyProjectId}` ); //  获取预付费访问用户和密码
  static GetPrepayProjects = (energyProjectId) => server.get(`Energy/SettlementOverview/GetPrepayProjects?energyProjectId=${energyProjectId}` ); //  获取预付费项目列表 
  static BaseInfoSummary = (projectId, energyProjectId) => server.get(`Energy/SettlementOverview/BaseInfoSummary?projectId=${projectId}&energyProjectId=${energyProjectId}`); // 获取项目费用的基本信息和告警信息
  static TransactionStatistics = (projectId, energyProjectId, yearMonthDay=3) => server.get(`Energy/SettlementOverview/TransactionStatistics?projectId=${projectId}&energyProjectId=${energyProjectId}&yearMonthDay=${yearMonthDay}`); // 获取项目收入和支付方式统计信息
  static EnergyRanking = (projectId, energyProjectId, yearMonthDay=3) => server.get(`Energy/SettlementOverview/EnergyRanking?projectId=${projectId}&energyProjectId=${energyProjectId}&yearMonthDay=${yearMonthDay}`); // 获取项目客户费用排名

  static EnergyTrends = (projectId, energyProjectId, yearMonthDay=3) => server.get(`Energy/SettlementOverview/EnergyTrends?projectId=${projectId}&energyProjectId=${energyProjectId}&yearMonthDay=${yearMonthDay}`); // 获取曲线数据
  
}

// zl api end
// 主页
export class Home {
  static BaseInfoSummary = (projectId) =>
    server.get(`/Home/BaseInfoSummary?projectId=${projectId}`); // 告警信息和客户信息汇总
  static TransactionStatistics = (projectId) =>
    server.get(`/Home/TransactionStatistics?projectId=${projectId}`); // 项目收入趋势和支付方式
  static EnergyRanking = (projectId) =>
    server.get(`/Home/EnergyRanking?projectId=${projectId}`); // 能耗排名
  static EnergyTrends = (projectId) =>
    server.get(`/Home/EnergyTrends?projectId=${projectId}`); // 用电/用水/用气趋势
}
 
// 项目管理
export class Project {
  static queryProject = ({
    pageNum,
    pageSize,
    projectName = "",
    valid = 0,
  } = {}) =>
    server.get(
      `/Project/QueryProjects?pageNum=${pageNum}&pageSize=${pageSize}&projectName=${projectName}&valid=${valid}`
    );
  static queryProjectByName = (data) =>
    server.post("/Project/QueryByProjectName", data); // 查询
  static addProject = (data) => server.post("/Project/AddProject", data); // 新增
  static UpdateBaseProject = (data) =>
    server.post("/Project/UpdateBaseProject", data); // 编辑
  static dellProject = (projectId) =>
    server.delete(`/Project/DeleteProject?projectId=${projectId}`); // 删除
  static UpdateProjectEnable = (projectId, state, code) =>
    server.get(
      `/Project/UpdateProjectEnable?projectId=${projectId}&state=${state}&code=${code}`
    ); // 修改发布状态
  static DeletePolicyFile = ({ policyFileKey = "", projectId = "" } = {}) =>
    server.delete(
      `/Project/DeletePolicyFile?policyFileKey=${policyFileKey}&projectId=${projectId}`
    ); // 删除政策性文件
  static QueryProjectById = (projectId) =>
    server.get(`/Project/QueryProjectById?projectId=${projectId}`); // 查询政策性文件
  // 修改项目-用户授权
  static getProjectUser = (projectId) =>
    server.get(`/User/GetProjectManager?projectId=${projectId}`); // 获取项目管理员用户
  static addProjectUser = (data) =>
    server.post(`/User/AddProjectManager`, data); // 添加项目管理员
  static getOperationManagerUsers = (data) =>
    server.get(`/User/GetOperationManagerUsers`); // 获取运营管理员列表
  static GetProjectOperator = (projectId) =>
    server.get(`/User/GetProjectOperator?projectId=${projectId}`); // 获取运维人员
  static AddProjectOperator = (params) =>
    server.post(`/User/AddProjectOperator`, params); //新增运维人员
  static DeleteProjectUser = (projectId, userId) =>
    server.delete(
      `/User/DeleteProjectUser?projectId=${projectId}&userId=${userId}`
    ); // 删除项目管理员或者运维人员
  static DeleteOperationManager = (projectId, userId) =>
    server.delete(
      `/User/ProjectDeleteOperationManager?projectId=${projectId}&userId=${userId}`
    ); // 删除运营管理员
  static getOperationUsers = (projectId) =>
    server.get(
      `/User/GetOperationManagerUsersByProjectId?projectId=${projectId}`
    ); // 获取已授权的运营管理员列表
  static ProjectAddOperationManager = (projectId, userId) =>
    server.get(
      `/User/ProjectAddOperationManager?projectId=${projectId}&userId=${userId}`
    ); // 授权运营管理员项目权限
  static SetFunction = (data) => server.post(`/User/SetFunction`, data); // 功能授权
  static GetMenus = ({ projectId = "", userId = "" } = {}) =>
    server.get(`/User/GetMenus?projectId=${projectId}&userId=${userId}`); // 获取功能菜单列表
  // 修改项目-设备配置--接入设备
  static QueryDeviceCategoryListInfos = (projectId) =>
    server.get(`/Project/QueryDeviceCategoryListInfos?projectId=${projectId}`); // 查询项目中接入的设备类型列表详情
  static QueryInsertDeviceCategoryList = (projectId) =>
    server.get(`/Project/QueryInsertDeviceCategoryList?projectId=${projectId}`); // 新增项目 下拉列表设备型号
  static QueryDataGroup = () => server.get(`/Project/QueryDataGroup`); // 查询数据组
  static QueryDeviceCategoryList = () =>
    server.get("/Project/QueryDeviceCategoryList"); // 获取设备类型
  static QueryDeviceCategoryPoints = (projectId, categoryId) =>
    server.get(
      `/Project/QueryDeviceCategoryPoints?projectId=${projectId}&categoryId=${categoryId}`
    ); // 查询项目设备型号点位信息
  static AddDeviceCategoryPoints = (form) =>
    server.post(`/Project/AddDeviceCategoryPoints`, form); // 新增项目设备型号和点位信息
  static UpdateDeviceCategoryPoints = (form) =>
    server.post(`/Project/UpdateDeviceCategoryPoints`, form); // 编辑项目设备型号和点位信息
  static DeleteProjectDeviceCategory = (projectCategoryId) =>
    server.delete(
      `/Project/DeleteProjectDeviceCategory?projectCategoryId=${projectCategoryId}`
    ); // 删除设备型号和点位信息
  // 修改项目-设备配置--接入网关
  static QueryInsertGatewayCategoryList = (projectId) =>
    server.get(
      `/Project/QueryInsertGatewayCategoryList?projectId=${projectId}`
    ); // 查询新增的网关型号列表
  static AddProjectGatewayCategory = (form) =>
    server.post(`/Project/AddProjectGatewayCategory`, form); // 新增项目网关型号
  static QueryGatewayCategoryList = (projectId) =>
    server.get(`/Project/QueryGatewayCategoryList?projectId=${projectId}`); // 查询项目网关型号列表
  static UpdateProjectGatewayCategory = (form) =>
    server.post(`/Project/UpdateProjectGatewayCategory`, form); // 编辑项目网关型号
  static DeleteProjectGatewayCategory = (projectGatewayCategoryId) =>
    server.get(
      `/Project/DeleteProjectGatewayCategory?projectGatewayCategoryId=${projectGatewayCategoryId}`
    ); // 删除
  // 修改项目-报警方案
  static QueryProjectAlarmSolution = ({
    projectId,
    pageNum = 1,
    pageSize = 10,
  } = {}) =>
    server.get(
      `/Project/QueryProjectAlarmSolution?projectId=${projectId}&pageNum=${pageNum}&pageSize=${pageSize}`
    ); // 查询项目报警方案
  static AddProjectAlarmSolution = (params) =>
    server.post(`/Project/AddProjectAlarmSolution`, params); // 新增
  static UpdateProjectAlarmSolution = (params) =>
    server.post(`/Project/UpdateProjectAlarmSolution`, params); // 编辑
  static DeleteProjectAlarmSolution = (projectAlarmSolutionId) =>
    server.delete(
      `/Project/DeleteProjectAlarmSolution?projectAlarmSolutionId=${projectAlarmSolutionId}`
    ); // 删除
  static DeleteProjectAlarmSolutionEvent = (projectAlarmSolutionEventId) =>
    server.delete(
      `/Project/DeleteProjectAlarmSolutionEvent?projectAlarmSolutionEventId=${projectAlarmSolutionEventId}`
    ); // 删除报警事件
  static GetAlarmType = () => server.get(`/Project/GetAlarmType`); // 查询报警类型列表
  // 修改项目--自定义
  static QueryProjectStyle = (projectId) =>
    server.get(`/Project/QueryProjectStyle?projectId=${projectId}`); // 查询项目自定义信息
  static UpdateProjectStyle = (form) =>
    server.post(`/Project/UpdateProjectStyle`, form); // 编辑项目自定义信息
  // 修改项目--账户信息
  static GetAccountInfo = (projectId) =>
    server.post(`/Project/GetAccountInfo?projectId=${projectId}`); // 查询账户信息
  static BankExamineRefuse = (merchantId) =>
    server.get(`/Project/BankExamineRefuse?merchantId=${merchantId}`); // 银行审核拒绝
  // 修改项目-- 拉闸信息
  static SwitchQuery = (projectId) =>
    server.post(`/Project/QuerySwitchSetting?projectId=${projectId}`); // 查询拉闸设置
  static SwitchSetting = ({
    projectId = "",
    balanceArrearageSwitchEnabled = 0,
    balanceArrearageThreshold = 0,
  } = {}) =>
    server.post(
      `/Project/SwittchSetting?projectId=${projectId}&balanceArrearageSwitchEnabled=${balanceArrearageSwitchEnabled}&balanceArrearageThreshold=${balanceArrearageThreshold}`
    ); // 查询拉闸设置
  // 修改项目--项目结算
  static SettlementSetting = (data) =>
    server.post(`/Project/SettlementSetting`, data); // 设置项目结算
  static GetSettlementSetting = (projectId) =>
    server.get(`/Project/GetSettlementSetting?projectId=${projectId}`); // 设置项目结算
}
// 设备监控
export class Meter {
  static Overview = ({
    projectId,
    meterType,
    bindStatus,
    lineStatus,
    alike = "",
    pageNum = 1,
    pageSize = 12,
  } = {}) =>
    server.get(
      `/Meter/Overview?projectId=${projectId}&meterType=${meterType}&lineStatus=${lineStatus}&bindStatus=${bindStatus}&pageNum=${pageNum}&pageSize=${pageSize}&alike=${alike}`
    ); // 查询设备监控
}
// 设备详情
export class DeviceDtl {
  static Detail = (id) => server.get(`/Meter/Detail?id=${id}`); // 设备详情
  static RunTimePoints = (sn) => server.get(`/Meter/RunTimePoints?sn=${sn}`); // 实时数据
  static HistoryTrend = (params) => server.post(`/Meter/HistoryTrend`, params); // 监测趋势-标准
  static HistoryTable = (params) => server.post(`/Meter/HistoryTable`, params); // 监测趋势-报表
  static EnergyActuary = (sn) => server.get(`/Meter/EnergyActuary?sn=${sn}`); // 能耗统计
  static EnergyTrend = (sn, type = 1) =>
    server.get(`/Meter/EnergyTrend?sn=${sn}&type=${type}`); // 能耗图表
  static EnergyReport = (sn, type = 1) =>
    server.get(`/Meter/EnergyReport?sn=${sn}&type=${type}`); // 能耗报表
  static AlarmLog = (params) => server.post(`/Meter/AlarmLog`, params); // 能耗报表
}
// 数据报表
export class DataReport {
  static RevenueSummary = (params) =>
    server.post(`/DataReport/RevenueSummary`, params); // 项目营收汇总
  static EnergyConsum = (charge, params) =>
    server.post(
      `/DataReport/EnergyConsumptionSummary?charge=${charge}`,
      params
    ); // 项目能耗费汇总
  static HistoryTable = (params) =>
    server.post(`/DataReport/PropertyFeeSummary`, params); // 项目物业费汇总
  static PublicEnergy = (params) =>
    server.post(`/DataReport/PublicEnergyConsumptionAnalysis`, params); // 项目公共能耗分析
  static GetCustomerBaseInfos = (projectId) =>
    server.post(`/DataReport/GetCustomerBaseInfos?projectId=${projectId}`); // 客户对账明细 - 客户查询
  static GetCustomers = (account, params) =>
    server.post(`/DataReport/GetCustomers?account=${account}`, params); // 客户能耗分析  查询客户基础信息
 
  static CustomerDtl = ({
    customerId = "",
    transactionType,
    startDate = "",
    endDate = "",
    pageNum = 1,
    pageSize = 20,
  } = {}) =>
    server.post(
      `/DataReport/CustomerReconciliationDetails?customerId=${customerId}&transactionType=${transactionType}&startDate=${startDate}&endDate=${endDate}&pageNum=${pageNum}&pageSize=${pageSize}`
    ); // 查询客户对账明细
  static ConsumptionDetails = ({
    customerId = "",
    transactionId = "",
    transactionTime = "",
  } = {}) =>
    server.post(
      `/DataReport/ConsumptionDetails?customerId=${customerId}&transactionId=${transactionId}&transactionTime=${transactionTime}`
    ); // 消费明细
  static ConsumptionAnalysis = ({
    customerId,
    date,
    yearMonthDay,
    type,
  } = {}) =>
    server.post(
      `/DataReport/CustomerEnergyConsumptionAnalysis?customerId=${customerId}&date=${date}&yearMonthDay=${yearMonthDay}&type=${type}`
    ); // 客户能耗分析
  static PropertyFeeAnalysis = ({ customerId, date, yearMonthDay } = {}) =>
    server.post(
      `/DataReport/PropertyFeeAnalysis?customerId=${customerId}&date=${date}&yearMonthDay=${yearMonthDay}`
    ); // 客户物业分析
}
// 系统配置
export class SystemConfig {
  static DownLoadDriver = () => server.get(`SystemConfig/DownLoadDriver`); //打印机下载
  static GetSystemConfigInfo = (url) =>
    server.get(`/SystemConfig/GetSystemConfigInfo?url=${url}`); // 查询系统配置
  static UpdateSystemConfigInfo = (form) =>
    server.post(`/SystemConfig/UpdateSystemConfigInfo`, form); // 编辑系统配置
}
//定价方案
export class PriceSolution {
  //水电燃气
  static GetEnablePriceSolution = (solutionName, id) =>
    server.get(
      `/PriceSolution/GetEnablePriceSolution?projectId=${id}&solutionName=${solutionName}`
    ); //查询定价方案
  static GetPriceType = () => server.get(`/PriceSolution/GetPriceType`); //查询定价列表
  static AddProjectRatePriceSolution = (data) =>
    server.post(`/PriceSolution/AddProjectRatePriceSolution`, data); //新增单、复费率价格方案
  static AddProjectTierPriceSolution = (data) =>
    server.post(`/PriceSolution/AddProjectTierPriceSolution`, data); //新增阶梯、混合价格方案
  static DeletePriceSolution = (id) =>
    server.delete(`PriceSolution/DeleteProjectPriceSolution?solutionId=${id}`); //删除价格方案
  static UpdatePriceSolutionName = (data) =>
    server.post(
      `PriceSolution/UpdatePriceSolutionName?projectId=${data.projectId}&solutionId=${data.solutionId}&solutionName=${data.solutionName}`
    ); //编辑定价方案名称
  static ModifyProjectRatePriceSolution = (data) =>
    server.post(`/PriceSolution/ModifyProjectRatePriceSolution`, data); //调价 - 调整费率价格
  static ModifyProjectTierPriceSolution = (data) =>
    server.post(`/PriceSolution/ModifyProjectTierPriceSolution`, data); //调价 - 调整费率价格
  static GetPriceSolution = (data) =>
    server.get(
      `/PriceSolution/GetPriceSolution?projectId=${data.projectId}&solutionId=${data.solutionId}`
    ); //查询调价记录
  static DeleteModifyPriceRecord = (data) =>
    server.delete(
      `/PriceSolution/DeleteModifyPriceRecord?solutionId=${data.solutionId}&ratePriceId=${data.ratePriceId}&tierPriceId=${data.tierPriceId}`
    ); //查询调价记录
  static UpdateProjectRatePriceSolution = (data) =>
    server.post(`/PriceSolution/UpdateProjectRatePriceSolution`, data); //调价记录 - 编辑费率调价记录
  static UpdateProjectTierPriceSolution = (data) =>
    server.post(`/PriceSolution/UpdateProjectTierPriceSolution`, data); //调价记录 - 编辑阶梯调价记录
  //物业
  static GetEnabledPropertyPriceSolutions = (projectId, solutionName) =>
    server.post(
      `/PriceSolution/GetEnabledPropertyPriceSolutions?projectId=${projectId}&solutionName=${solutionName}`
    ); //查询物业方案
  static GetPropertyPriceSolution = (data) =>
    server.post(
      `/PriceSolution/GetPropertyPriceSolution?projectId=${data.projectId}&solutionId=${data.solutionId}`
    ); //查询物业方案中的价格
  static AddPropertyPriceSolution = (data) =>
    server.post(`/PriceSolution/AddPropertyPriceSolution`, data); //添加物业方案
  static ModifyPropertyPrice = (data) =>
    server.post(`/PriceSolution/ModifyPropertyPrice`, data); //物业方案 - 调价
  static UpdatePropertyPrice = (data) =>
    server.post(`/PriceSolution/UpdatePropertyPrice`, data); //物业方案调价记录 - 修改待启用的记录
  static UpdatePropertyPriceSolutionName = (data) =>
    server.post(
      `/PriceSolution/UpdatePropertyPriceSolutionName?projectId=${data.projectId}&solutionId=${data.solutionId}&name=${data.name}`
    ); //编辑物业方案名称
  static DeletePropertyPrice = (data) =>
    server.delete(
      `/PriceSolution/DeletePropertyPrice?solutionId=${data.solutionId}&propertyPriceId=${data.propertyPriceId}`
    ); //删除某个物业方案下的价格记录
  static DeletePropertyPriceSolution = (solutionId) =>
    server.delete(
      `/PriceSolution/DeletePropertyPriceSolution?solutionId=${solutionId}`
    ); //删除物业方案
 
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
  static GetLogOperation = (data) =>
    server.get(
      `LogOperation/GetLogOperation?start=${data.start}&end=${data.end}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    );
}
export const GetLogOperation = (data) =>
  server.get(
    `LogOperation/GetLogOperation?start=${data.start}&end=${data.end}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
  );
//保电方案
export class PowerProtect {
  static AddPowerProtectSolution = (data) =>
    server.post(`/PowerProtect/AddPowerProtectSolution`, data);
  static GetPowerProtectSolution = (data) =>
    server.get(
      `PowerProtect/GetPowerProtectSolution?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&conditional=${data.conditional}`
    );
  static DeletePowerProtectSolution = (id) =>
    server.delete(
      `PowerProtect/DeletePowerProtectSolution?powerProtectId=${id}`
    );
  static UpdatePowerProtectSolution = (data) =>
    server.post(`/PowerProtect/UpdatePowerProtectSolution`, data);
  static GetPowerProtectSolutionList = (id) =>
    server.get(`PowerProtect/GetPowerProtectSolutionList?projectId=${id}`);
}
//客户管理
export class Customer {
  static GetNotBindCustomerDevice = (data) =>
    server.get(
      `/Customer/GetNotBindCustomerDevice?projectId=${data.projectId}&conditional=${data.conditional}`
    ); //未绑定客户的设备（新增设备查询电表或水表等）
  static GetNotBindCustomerDeviceByPage = (data) =>
    server.post(
      `/Customer/GetNotBindCustomerDeviceByPage?projectId=${data.projectId}&meterType=${data.meterType}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //未绑定客户的设备（新增设备查询电表或水表等）
  static GetPropertySolutionList = (id) =>
    server.get(`/Customer/GetPropertySolutionList?projectId=${id}`); //查询物业方案列表
  static GetAlarmSolutionList = (id) =>
    server.get(`/Customer/GetAlarmSolutionList?projectId=${id}`); //查询报警方案列表
  static GetPriceSolutionList = (data) =>
    server.get(
      `/Customer/GetPriceSolutionList?projectId=${data.projectId}&solutionType=${data.solutionType}`
    ); //查询定价方案列表
  static AddCustomer = (data) => server.post(`/Customer/AddCustomer`, data); //新增客户
  static UpdateCustomer = (data) =>
    server.post(`/Customer/UpdateCustomer`, data); //编辑客户
  static DeleteCustomer = (id) =>
    server.delete(`Customer/DeleteCustomer?customerId=${id}`); //删除客户
  static GetCustomers = (data) => server.post(`/Customer/GetCustomers`, data); //查询客户信息
  static GetCustomerList = (id) =>
    server.get(`/Customer/GetCustomerList?projectId=${id}`); //查询客户列表
  static UpdateEnableCustomer = (data) =>
    server.get(
      `/Customer/UpdateEnableCustomer?customerId=${data.customerId}&enabled=${data.enabled}`
    ); //启停用客户
  static GetReplaceCustomerDevicies = (data) =>
    server.post(
      `/Customer/GetReplaceCustomerDevicies?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //查询更换设备的信息
  static ReplaceCustomerDevicies = (data) =>
    server.post(`/Customer/ReplaceCustomerDevicies`, data); //客户更换设备
  static AddCustomerDevicies = (data) =>
    server.post(`/Customer/AddCustomerDevicies`, data); //客户新增设备
  static UnboundCustomerDevicies = (data) =>
    server.post(
      `Customer/UnboundCustomerDevicies?customerId=${data.customerId}&deviceId=${data.deviceId}&E=${data.E}&E1=${data.E1}&E2=${data.E2}&E3=${data.E3}&E4=${data.E4}`
    ); //客户解绑设备
  static GetPriceBySolutionId = (solutionId) =>
    server.get(`Customer/GetPriceBySolutionId?solutionId=${solutionId}`); //查询价格
  static GetDeviceReadings = (deviceId) =>
    server.get(`/Customer/GetDeviceReadings?deviceId=${deviceId}`); //系统获取表的尖峰平谷值
  static GetCustomerSingle = (id) =>
    server.get(`Customer/GetCustomerSingle?id=${id}`); //查询客户信息
}
//后台管理
export class Backstage {
  //区域
  static GetProjectRegionList = (id) =>
    server.get(`Backstage/GetProjectRegionList?projectId=${id}`); //查询区域列表
  static AddProjectRegion = (data) =>
    server.post(`/Backstage/AddProjectRegion`, data); //新增区域
  static GetProjectRegions = (data) =>
    server.get(`/Backstage/GetProjectRegions`, { params: data }); //查询区域
  static DeleteProjectRegion = (id) =>
    server.delete(`/Backstage/DeleteProjectRegion?projectRegionId=${id}`); //删除区域
  static UpdateProjectRegion = (data) =>
    server.post(`/Backstage/UpdateProjectRegion`, data); //编辑区域
  static AddProjectBuilding = (data) =>
    server.post(`/Backstage/AddProjectBuilding`, data); //新增建筑
  static GetProjectBuilding = (data) =>
    server.get(`/Backstage/GetProjectBuilding`, { params: data }); //查询建筑
  static DeleteProjectBuilding = (id) =>
    server.delete(`/Backstage/DeleteProjectBuilding?projectBuildingId=${id}`); //删除建筑
  static UpdateProjectBuilding = (data) =>
    server.post(`/Backstage/UpdateProjectBuilding`, data); //编辑建筑
  static GetProjectBuildingList = (data) =>
    server.get(
      `/Backstage/GetProjectBuildingList?projectId=${data.projectId}&regionId=${data.regionId}`
    );
  static AddProjectFloor = (data) =>
    server.post(`Backstage/AddProjectFloor`, data); //添加楼层
  static GetProjectFloorList = (data) =>
    server.get(
      `/Backstage/GetProjectFloorList?buildingId=${data.buildingId}&projectId=${data.projectId}`
    ); //查询楼层列表
  static GetProjectFloor = (data) =>
    server.get(`/Backstage/GetProjectFloor`, { params: data }); //查询楼层数据
  static UpdateProjectFloor = (data) =>
    server.post(`/Backstage/UpdateProjectFloor`, data); //编辑楼层
  static DeleteProjectFloor = (id) =>
    server.delete(`/Backstage/DeleteProjectFloor?projectFloorId=${id}`); //删除楼层
  static AddProjectRoom = (data) =>
    server.post(`/Backstage/AddProjectRoom`, data); //新增房间信息
  static GetProjectRoomList = (data) =>
    server.get(
      `/Backstage/GetProjectRoomList?floorId=${data.floorId}&projectId=${data.projectId}`
    ); //查询房间列表
  static GetProjectRoom = (data) =>
    server.get(`/Backstage/GetProjectRoom`, { params: data }); //查询房间信息
  static UpdateProjectRoom = (data) =>
    server.post(`/Backstage/UpdateProjectRoom`, data); //编辑房间信息
  static DeleteProjectRoom = (id) =>
    server.delete(`/Backstage/DeleteProjectRoom?projectRoomId=${id}`); //删除房间
  static GetProjectEnergyCategory = (data) =>
    server.get(
      `/Backstage/GetProjectEnergyCategory?projectId=${data.projectId}&meterType=${data.meterType}`
    ); //查询能耗
  static AddProjectEnergyCategory = (data) =>
    server.post(`/Backstage/AddProjectEnergyCategory`, data); //添加能耗
  static UpdateProjectEnergyCategory = (data) =>
    server.post(`/Backstage/UpdateProjectEnergyCategory`, data); //编辑能耗
  static DeleteProjectEnergyCategory = (id) =>
    server.delete(
      `/Backstage/DeleteProjectEnergyCategory?energyCategoryId=${id}`
    ); //删除能耗
  static UpdaceDeviceProjectEnergyCategory = (id, data) =>
    server.post(
      `/Backstage/UpdaceDeviceProjectEnergyCategory?projectId=${id}`,
      data
    ); //修改设备能耗类别
  static AddProjectLine = (data) =>
    server.post(`/Backstage/AddProjectLine`, data); //添加进线
  static GetProjectLineNode = (id) =>
    server.get(`/Backstage/GetProjectLineNode?projectId=${id}`); //查询线路的树形结构
  static UpdateProjectLine = (data) =>
    server.post(`/Backstage/UpdateProjectLine`, data); //编辑进线
  static GetDeviceByProjectLine = (id, lineId) =>
    server.get(
      `/Backstage/GetDeviceByProjectLine?projectId=${id}&projectLineId=${lineId}`
    ); //查询线路下的设备
  static DeleteProjectLine = (id) =>
    server.delete(`/Backstage/DeleteProjectLine?lineId=${id}`); //删除线路
  static UpdateDeviceProjectLine = (projectId, lineId, data) =>
    server.post(
      `/Backstage/UpdateDeviceProjectLine?projectId=${projectId}&lineId=${lineId}`,
      data
    ); //配置线路
  static GetRBFRHierarchical = (id) =>
    server.post(`/Backstage/GetRBFRHierarchical?projectId=${id}`); //级联查询（区域建筑楼层房间）
}
//账单报表
export class AccountReport {
  static GetAccountTransactions = (data) =>
    server.post(`AccountReport/GetAccountTransactions`, data); //查询账户交易
  static GetRefundInfo = (data) =>
    server.post(`AccountReport/GetRefundInfo`, data); //查询退费处理
  static GetRefundProcessList = (data) =>
    server.get(`/AccountReport/GetRefundProcessList`, data); //查询退费流程列表
  static RefundApply = (data) =>
    server.post(
      `/AccountReport/RefundApply?customerOrderId=${data.customerOrderId}&refundFlag=${data.refundFlag}`
    ); //同意/打回
  static RefundOperation = (data) =>
    server.post(
      `/AccountReport/RefundOperation?customerOrderId=${data.customerOrderId}&orderType=${data.orderType}&remark=${data.remark}`
    ); //退费操作
}
 
//充值补助
export class RechargeSubsidy {
  static GetSubsidyInfo = (data) =>
    server.post(`RechargeSubsidy/GetSubsidyInfo`, data); //查询补助信息
  static GetCustomers = (data) =>
    server.post(`/RechargeSubsidy/GetCustomerInfo`, data); //查询客户信息
  static ManualRecharge = (amount, projectId, data) =>
    server.post(
      `/RechargeSubsidy/ManualRecharge?amount=${amount}&projectId=${projectId}`,
      data
    ); //查询客户信息
  static FileRecharge = (data) =>
    server.post(`/RechargeSubsidy/FileRecharge`, data); //文件充值
}
 
//设备管理
export class SettingManage {
  static FindAlike = (data) =>
    server.get(
      `Meter/FindAlike?projectId=${data.projectId}&enableState=${data.enableState}&customerType=${data.customerType}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //表计模糊查询
  static GatewayFindAlike = (data) =>
    server.get(
      `Gateway/FindAlike?projectId=${data.projectId}&enableState=${data.enableState}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //网关模糊查询
  // static GetCategorys = () => server.get(`Gateway/GetCategorys`)//网关型号列表-----原来接口，已被下面的接口替代
  static GetCategorys = (projectId) =>
    server.get(`Gateway/GetCategorysInProject?project=${projectId}`); //网关型号列表
  static Add = (data) => server.post(`Gateway/Add`, data); //新增网关
  static Update = (data) => server.post(`Gateway/Update`, data); //编辑网关
  static Delete = (id) => server.delete(`Gateway/Delete?id=${id}`); //编辑网关
  static QueryAlarmPlans = (projectId) =>
    server.get(`Meter/QueryAlarmPlans?projectId=${projectId}`); //获取项目下表计告警方案
  static DeQueryAlarmPlanItemslete = (planId) =>
    server.get(`Meter/QueryAlarmPlanItems?planId=${planId}`); //获取告警方案子项
  static UpdateAlarmPlanItem = (data) =>
    server.post(`Meter/UpdateAlarmPlanItem`, data); //修改告警方案子项
  // static GetMeterCategorys = (meterType) => server.get(`Meter/GetCategorys?meterType=${meterType}`)//获取设备型号-----原来接口，已被下面的接口替代
  static GetMeterCategorys = (meterType, projectId) =>
    server.get(
      `Meter/GetCategorysInProject?meterType=${meterType}&project=${projectId}`
    ); //获取设备型号
  static FindSimpleList = (projectId) =>
    server.get(`Gateway/FindSimpleList?projectId=${projectId}`); //获取简易网关列表
  static MeterAdd = (data) => server.post(`Meter/Add`, data); //获取简易网关列表
  static MeterDelete = (id) => server.delete(`Meter/Delete?id=${id}`); //表计-删除
  static MeterUpdate = (data) => server.post(`Meter/Update`, data); //表计-修改
  static MeterImportChild = (data) => server.post(`Meter/ImportChild`, data); //表计-excel导入子设备
  static MeterImportDirect = (data) => server.post(`Meter/ImportDirect`, data); //表计-excel导入直连设备
}
//远程控制
export class Remote {
  static AllMeter = (data) =>server.post( `/Monitor/RuntimeRemote/Overview`,data); //查询设备
  static AllCallMeter = (data) =>server.post( `/Monitor/RuntimeRemote/Call`,data); //查询设备抄读
  static SetResult = (data) =>server.post( `/Monitor/RuntimeRemote/SetResult`,data); //返回结果
  static FindPowerProtect = (projectId) =>server.get(`/Monitor/RuntimeRemote/FindPowerProtect?projectId=${projectId}`); //获取保电方案简易列表
  static StartBatchValveTask = (data) => server.post(`/Monitor/RuntimeRemote/StartBatchValveTask`, data); //发起批量抄读阀门状态任务
  static BatchValveResponse = (data) =>server.post(`/Monitor/RuntimeRemote/BatchValveResponse`, data); //查询批量抄读阀门状态结果
  static StartCalling = (data) => server.post(`/Monitor/RuntimeRemote/StartCalling`, data); //发起批量抄读测点任务
  static CallingResponse = (data) =>server.post(`/Monitor/RuntimeRemote/CallingResponse`, data); //查询批量抄读测点结果
  static Open = (data) => server.post(`/Monitor/RuntimeRemote/Open`, data); //批量分闸
  static OpenForce = (data) => server.post(`/Monitor/RuntimeRemote/OpenForce`, data); //拉闸结算
  static Close = (data) => server.post(`/Monitor/RuntimeRemote/Close`, data); //批量合闸
  static SetPowerProtect = (powerSolutionId, data) =>server.post(`/Monitor/RuntimeRemote/SetPowerProtect?powerSolutionId=${powerSolutionId}`,data); //设置保电方案
  static RemovePowerProtect = (data) =>server.post(`/Monitor/RuntimeRemote/RemovePowerProtect`, data); //取消保电方案
  static FindAlarmSolution = (projectId) =>server.get(`/Monitor/RuntimeRemote/FindAlarmSolution?projectId=${projectId}`); //获取报警方案简易列表
  static SetAlarmSolution = (alarmSolutionId, data) =>server.post(`/Monitor/RuntimeRemote/SetAlarmSolution?alarmSolutionId=${alarmSolutionId}`,data); //设置报警方案
  static RemoveAlarmSolution = (data) =>server.post(`/Monitor/RuntimeRemote/RemoveAlarmSolution`, data); //取消告警方案
  static Log = (data) => server.post(`/Monitor/RuntimeRemote/Log`, data); //查询操作日志
  static BatchValveStatus = (data) =>server.post(`/Monitor/RuntimeRemote/BatchValveStatus`, data); //批量查询阀门当前状态
}
export const OpLog = (data) => server.post(`Remote/Log`, data);
//能源账户充值
export class EnergyAccount {
  static EnergyCharge = (data) =>
    server.post(
      `EnergyAccount/EnergyCharge?projectId=${data.projectId}&customerId=${data.customerId}&amount=${data.amount}&payMode=${data.payMode}&code=${data.code}`
    ); //能源账户充值
  static EnergyAccountRefund = (data) =>
    server.post(
      `EnergyAccount/EnergyAccountRefund?customerId=${data.customerId}&orderType=${data.orderType}&amount=${data.amount}&remark=${data.remark}`
    ); //能源账户退费
  static EnergyAccountSettlement = (data) =>
    server.post(
      `EnergyAccount/EnergyAccountSettlement?customerId=${data.customerId}&remark=${data.remark}`
    ); //能源账户结算
}
//物业账户充值
export class PropertyAccount {
  static PropertyCharge = (data) =>
    server.post(
      `PropertyAccount/PropertyCharge?projectId=${data.projectId}&customerId=${data.customerId}&amount=${data.amount}&payMode=${data.payMode}&walletType=${data.walletType}&code=${data.code}`
    ); //物业账户充值
  static PropertyAccountRefund = (data) =>
    server.post(
      `PropertyAccount/PropertyAccountRefund?customerId=${data.customerId}&orderType=${data.orderType}&amount=${data.amount}&remark=${data.remark}`
    ); //物业账户退费
  static PropertyAccountSettlement = (customerId) =>
    server.post(
      `EnergyAccount/PropertyAccountSettlement?customerId=${customerId}`
    ); //物业账户结算
}
//通知告警
export class Warning {
  static FindAlikeDevice = (data) =>
    server.get(
      `Alarm/FindAlikeDevice?projectId=${data.projectId}&region=${data.region}&building=${data.building}&floor=${data.floor}&room=${data.room}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&alike=${data.alike}`
    ); //设备告警
  static FindAlikeAccount = (data) =>
    server.get(
      `Alarm/FindAlikeAccount?projectId=${data.projectId}&region=${data.region}&building=${data.building}&floor=${data.floor}&room=${data.room}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&alike=${data.alike}`
    ); //账号余额告警
  static FindRecord = (data) =>
    server.get(
      `Alarm/FindRecord?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //告警消息推送
}
 
//系统日志
export class SystemLog {
  static SystemLogQueryPage = (data) =>
    server.get(
      `SystemLog/QueryPage?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //查询系统日志
  static SystemLogDetail = (id) => server.get(`SystemLog/Query?id=${id}`); //查询系统日志详情
}
 
//手动抄表
export class Mannul {
  static GetRecords = (data) =>
    server.get(
      `ManualMeterReading/GetRecords?projectId=${data.projectId}&alike=${data.alike}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`
    ); //插叙手插记录
  static GetCustomers = (data) =>
    server.get(
      `ManualMeterReading/GetCustomers?projectId=${data.projectId}&alike=${data.alike}`
    ); //查询客户
  static GetDevices = (data) =>
    server.get(
      `ManualMeterReading/GetDevices?projectId=${data.projectId}&customerId=${data.customerId}`
    ); //查询设备
  static SetManual = (data) =>
    server.post(`ManualMeterReading/SetManual`, data); //写入抄表记录
}
 
//客户报告
export class UserReportApi {
  static GetUserReport = (data) =>
    server.get(
      `CustomerReport/GetUserReport?projectId=${data.projectId}&date=${data.date}&yearMonth=${data.yearMonth}`
    ); //查询客户报告
}
export const GetCamerasVideosByProjectId = (Id) =>
  server.get(`/Camera/GetCamerasByHouseId?houseId=${Id}`);
 
export const leftControl = (params, url, ip, channel, user, pwd) =>
  server.post(
    "http://" +
    url +
    "/V1/Ptz/PtzLeft?ip=" +
    ip +
    "&channel=" +
    channel +
    "&user=" +
    user +
    "&pwd=" +
    pwd,
    params
  );
export const bottomControl = (params, url, ip, channel, user, pwd) =>
  server.post(
    "http://" +
    url +
    "/V1/Ptz/PtzDown?ip=" +
    ip +
    "&channel=" +
    channel +
    "&user=" +
    user +
    "&pwd=" +
    pwd,
    params
  );
export const rightControl = (params, url, ip, channel, user, pwd) =>
  server.post(
    "http://" +
    url +
    "/V1/Ptz/PtzRight?ip=" +
    ip +
    "&channel=" +
    channel +
    "&user=" +
    user +
    "&pwd=" +
    pwd,
    params
  );
export const topControl = (params, url, ip, channel, user, pwd) =>
  server.post(
    "http://" +
    url +
    "/V1/Ptz/PtzUp?ip=" +
    ip +
    "&channel=" +
    channel +
    "&user=" +
    user +
    "&pwd=" +
    pwd,
    params
  );
export const stopControl = (params, url, ip, channel, user, pwd) =>
  server.post(
    "http://" +
    url +
    "/V1/Ptz/PtzStop?ip=" +
    ip +
    "&channel=" +
    channel +
    "&user=" +
    user +
    "&pwd=" +
    pwd,
    params
  );
 
//首页
export class UISummary {
  static InsertUISummary = (projectId, data) =>
    server.post(`UISummary/UISummary/Insert?projectId=${projectId}`, data); // 保存UI
  static QueryUISummary = (projectId) =>
    server.get(`UISummary/UISummary/Query?projectId=${projectId}`); // 查询UI
}
//运行监控
export const Monitoring = {
  //设备类型管理
  DeviceTypeManager: {
    GatewayCategory: (data) => server.get(`/Monitor/GatewayCategory/QueryByPage?projectId=${data.projectId}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`), //获取网关列表
    AllDeviceStyle: () => server.get('/Monitor/DeviceCategory/AllDeviceStyle'),//获取设备类型
    AddCategory: (data) => server.post('/Monitor/GatewayCategory/AddCategory', data),//新增网管类型
    QueryNotUsed: (id) => server.get('/Monitor/GatewayCategory/QueryNotUsed?projectId=' + id),//查询未使用的网关类型
    UpdateCategory: (data) => server.post('/Monitor/GatewayCategory/UpdateCategory', data),//更新网关设备类型
    DeleteCategory: (data) => server.delete(`/Monitor/GatewayCategory/Delete?projectId=${data.projectId}&category=${data.category}&deviceStyle=${data.deviceStyle}`),//删除网关设备
    DeviceQueryNotUsed: (data) => server.get(`/Monitor/DeviceCategory/QueryNotUsed?projectId=${data.projectId}&deviceStyle=${data.deviceStyle}`),//获取未使用设备类型
    DeviceQueryCategoryFull: (data) => server.get(`/Monitor/DeviceCategory/QueryCategoryFull?projectId=${data.projectId}&category=${data.category}`), //获取对应设备类型的详细信息
    AddDeviceCategory: (data) => server.post(`/Monitor/DeviceCategory/AddCategory`, data),//新增设备类型
    DeviceCategory: (data) => server.get(`/Monitor/DeviceCategory/QueryByPageFull?projectId=${data.projectId}&deviceStyle=${data.deviceStyle}&pageNum=${data.pageNum}&pageSize=${data.pageSize}`),//获取设备列表
    UpdateDeviceCategory: (data) => server.post(`/Monitor/DeviceCategory/UpdateCategory`, data),//更新设备
    DeleteDeviceCategory: (data) => server.delete(`/Monitor/DeviceCategory/Delete?projectId=${data.projectId}&category=${data.category}&deviceStyle=${data.deviceStyle}`),//删除设备
  },
  //设备管理

  DeviceManager: {
    AeraQueryAll: (projectId) => server.get(`/General/Area/QueryAll?projectId=${projectId}&level=1`),//获取区域
    OneLevel: (projectId) => server.get(`/General/Area/OneLevel?projectId=${projectId}&level=1`),//获取1级区域名
    QueryByPageElectric: (data) => server.post(`/Monitor/Device/QueryByPageElectric`, data),//获取电表
    QueryByPage: (data) => server.post(`/Monitor/Device/QueryByPage`, data),
    QueryByPageGateWay: (data) => server.post(`/Monitor/Gateway/QueryByPage`, data),//获取网关
    QueryListGateWay: (projectId) => server.get(`/Monitor/Gateway/QueryList?projectId=${projectId}`),//网关列表
    QueryUsedGateway: (projectId) => server.get(`/Monitor/GatewayCategory/QueryUsed?projectId=${projectId}`),//获取使用的网关
    QueryUsedDeviceCategory: (data) => server.get(`/Monitor/DeviceCategory/QueryUsed?projectId=${data.projectId}&deviceStyle=${data.deviceStyle}`),//获取设备类型
    GatewayAdd: (data) => server.post(`/Monitor/Gateway/Add`, data),//新增网关
    GatewayUpdate: (data) => server.post(`/Monitor/Gateway/Update`, data),//更新网关
    GatewayDelete: (data) => server.delete(`/Monitor/Gateway/Delete?projectId=${data.projectId}&id=${data.id}`),//删除网关
    QueryPlanList: (projectId) => server.get(`/Safe/Alarm/QueryPlanList?projectId=${projectId}`),//告警计划
    AddElectric: (data) => server.post(`/Monitor/Device/AddElectric`, data),//新增电表
    UpdateElectric: (data) => server.post(`/Monitor/Device/UpdateElectric`, data),//更新电表
    UpdateFactor: (data) => server.get(`/Monitor/Device/UpdateFactor?projectId=${data.projectId}&id=${data.id}&factor=${data.factor}`),//更新倍率
    DeleteElectric: (data) => server.delete(`/Monitor/Device/DeleteElectric?projectId=${data.projectId}&id=${data.id}`),//删除电表
    QueryByPageWater: (data) => server.post(`/Monitor/Device/QueryByPageWater`, data),//查询水表
    AddWater: (data) => server.post(`/Monitor/Device/AddWater`, data),//新增水表
    UpdateWater: (data) => server.post(`/Monitor/Device/UpdateWater`, data),//更新水表
    DeleteWater: (data) => server.delete(`/Monitor/Device/DeleteWater?projectId=${data.projectId}&id=${data.id}`),//删除水表
    QueryByPageGas: (data) => server.post(`/Monitor/Device/QueryByPageGas`, data),//查询燃气表
    AddGas: (data) => server.post(`/Monitor/Device/AddGas`, data),//新增燃气表
    UpdateGas: (data) => server.post(`/Monitor/Device/UpdateGas`, data),//更新燃气表
    DeleteGas: (data) => server.delete(`/Monitor/Device/DeleteGas?projectId=${data.projectId}&id=${data.id}`),//删除燃气表
    QueryByPageSensor: (data) => server.post(`/Monitor/Device/QueryByPageSensor`, data),//查询传感器
    AddSensor: (data) => server.post(`/Monitor/Device/AddSensor`, data),//新增传感器
    UpdateSensor: (data) => server.post(`/Monitor/Device/UpdateSensor`, data),//更新传感器
    DeleteSensor: (data) => server.delete(`/Monitor/Device/DeleteSensor?projectId=${data.projectId}&id=${data.id}`),//删除传感器
    QueryByPageTransformer: (data) => server.post(`/Monitor/Device/QueryByPageTransformer`, data),//查询变压器
    AddTransformer: (data) => server.post(`/Monitor/Device/AddTransformer`, data),//新增变压器
    UpdateTransformer: (data) => server.post(`/Monitor/Device/UpdateTransformer`, data),//更新变压器
    DeleteTransformer: (data) => server.delete(`/Monitor/Device/DeleteTransformer?projectId=${data.projectId}&id=${data.id}`),//删除变压器
    QueryByPageCamera: (data) => server.post(`/Monitor/Device/QueryByPageCamera`, data),//查询视频监控
    AddCamera: (data) => server.post(`/Monitor/Device/AddCamera`, data),//新增视频监控
    UpdateCamera: (data) => server.post(`/Monitor/Device/UpdateCamera`, data),//更新视频监控
    DeleteCamera: (data) => server.delete(`/Monitor/Device/DeleteCamera?projectId=${data.projectId}&id=${data.id}`),//删除视频监控
    StartReboot: (sn) => server.get(`/Monitor/Gateway/StartReboot?sn=${sn}`),//重启网关
    StartDownloadTask: (projectId,sn) => server.get(`/Monitor/Gateway/StartDownloadTask?projectId=${projectId}&sn=${sn}`),//参数下发
    DownloadTaskState: (sn) => server.get(`/Monitor/Gateway/DownloadTaskState?sn=${sn}`),//参数下发
    State: (sn) => server.get(`/Monitor/Gateway/State?sn=${sn}`),//重启网关状态
    GatewayImport: (data) => server.post(`/Monitor/Gateway/Import`, data),//导入网关
    ImportElectric: (data) => server.post(`/Monitor/Device/ImportElectric`, data),//导入电表
    ImportWater: (data) => server.post(`/Monitor/Device/ImportWater`, data),//导入水表
    ImportGas: (data) => server.post(`/Monitor/Device/ImportGas`, data),//导入燃气表
    ImportSensor: (data) => server.post(`/Monitor/Device/ImportSensor`, data),//导入传感器
    ImportTransformer: (data) => server.post(`/Monitor/Device/ImportTransformer`, data),//导入变压器
    ImportCamera: (data) => server.post(`/Monitor/Device/ImportCamera`, data),//导入视频监控
  },
  //公共照明管理
  PubliclightManager: {
    AeraQueryAll: (projectId) => server.get(`/General/Area/QueryAll?projectId=${projectId}&level=1`),//获取区域 
    PublicLightAdd: (data) => server.post(`/Monitor/PublicLight/Add`, data),//新增公共照明
    PublicLightQueryByPage: (data) => server.post(`/Monitor/PublicLight/QueryByPage`, data),//公共照明
    PublicLightUpdate: (data) => server.post(`/Monitor/PublicLight/Update`, data),//更新公共照明
    PublicLightDelete: (data) => server.delete(`/Monitor/PublicLight/Delete?projectId=${data.projectId}&id=${data.id}`),//删除公共照明
    PublicLightImport: (data) => server.post(`/Monitor/PublicLight/Import`, data),//批量导入
    StreetLightAdd: (data) => server.post(`/Monitor/StreetLight/Add`, data),//新增园区照明
    StreetLightQueryByPage: (data) => server.post(`/Monitor/StreetLight/QueryByPage`, data),//园区照明
    StreetLightUpdate: (data) => server.post(`/Monitor/StreetLight/Update`, data),//更新园区照明
    StreetLightDelete: (data) => server.delete(`/Monitor/StreetLight/Delete?projectId=${data.projectId}&id=${data.id}`),//删除园区照明
    StreetLightImport: (data) => server.post(`/Monitor/StreetLight/Import`, data),//批量导入
  },
  //线路管理
  LineManager: {
    AeraQueryAll: (projectId) => server.get(`/General/Area/QueryAll?projectId=${projectId}&level=1`),//获取区域 
    LineManagerQuery: ({projectId, type, areaId, lineName=''}) => server.get(`/Monitor/LineManager/Query?projectId=${projectId}&type=${type}&areaId=${areaId}&lineName=${lineName}`),//线路查询
    LineManagerAdd: (data) => server.post(`/Monitor/LineManager/Add`, data),//新增线路       
    LineManagerUpdate: (data) => server.get(`/Monitor/LineManager/Update?projectId=${data.projectId}&id=${data.id}&name=${data.name}`),//编辑线路
    LineManagerDelete: (data) => server.get(`/Monitor/LineManager/Delete?projectId=${data.projectId}&id=${data.id}`),//删除线路
    QueryUnusedMeter: (data) => server.get(`/Monitor/LineManager/QueryUnusedMeter?projectId=${data.projectId}&type=${data.type}&areaId=${data.areaId}&alike=${data.alike}`),//未使用线路
    ConfigureMeter: (data) => server.post(`/Monitor/LineManager/ConfigureMeter`, data)//线路管理
  },
  //运行监控
  Runtime: {
    RuntimeStatistics: (data) => server.get(`/Monitor/Runtime/Statistics?projectId=${data.projectId}&areaId=${data.areaId}`),//设备统计
    RuntimeStatus: (data) => server.get(`/Monitor/Runtime/Status?projectId=${data.projectId}&areaId=${data.areaId}`),//在线情况
    RuntimeQueryMonthUsage: (data) => server.get(`/Monitor/Runtime/QueryMonthUsage?projectId=${data.projectId}&areaId=${data.areaId}&type=${data.type}`),//月用量
  },
  //网关检测
  RuntimeGateway: {
    RuntimeGatewayStatistics: (data) => server.get(`/Monitor/RuntimeGateway/Statistics?projectId=${data.projectId}&areaId=${data.areaId}`),//
    Overview: (data) => server.post(`/Monitor/RuntimeGateway/Overview`, data),//
    CategoryImages: ({ projectId, group }) => server.post(`/Monitor/RuntimeGateway/CategoryImages`, { projectId, group }),//网关图片
    RuntimeGatewayDetail: (projectId, sn) => server.get(`/Monitor/RuntimeGateway/Detail?projectId=${projectId}&sn=${sn}`),//网关详情
    Children: (data) => server.post(`/Monitor/RuntimeGateway/Children`, data),//网关子设备
    Log: (data) => server.post(`/Monitor/RuntimeGateway/Log`, data),//日志
  },
  RuntimeDevice:{
    Statistics: (data) => server.get(`/Monitor/RuntimeDevice/Statistics?projectId=${data.projectId}&areaId=${data.areaId}&deviceStyle=${data.deviceStyle}`),//设备信息
    Overview: (data) => server.post(`/Monitor/RuntimeDevice/Overview`, data),//
    CategoryImages: ({ projectId, group }) => server.post(`/Monitor/RuntimeDevice/CategoryImages`, { projectId, group }),//设备图片
    Detail: (projectId,sn) => server.get(`/Monitor/RuntimeDevice/Detail?projectId=${projectId}&sn=${sn}`),//设备详情
    Current: (projectId,sn) => server.get(`/Monitor/RuntimeDevice/Current?projectId=${projectId}&sn=${sn}`),//设备
    HistoryTrend: (data) => server.post(`/Monitor/RuntimeDevice/HistoryTrend`, data),//
    HistoryTable: (data) => server.post(`/Monitor/RuntimeDevice/HistoryTable`, data),//
    EnergyActuary: (projectId,sn) => server.get(`/Monitor/RuntimeDevice/EnergyActuary?projectId=${projectId}&sn=${sn}`),//
    EnergyReport: (data) => server.post(`/Monitor/RuntimeDevice/EnergyReport`, data),//
    AlarmPage: (data) => server.post(`/Monitor/RuntimeDevice/AlarmPage`, data),//
  },
  //视频监控
  RuntimeCamera:{
    Statistics: (projectId,areaId) => server.get(`/Monitor/RuntimeCamera/Statistics?projectId=${projectId}&areaId=${areaId}`),//
    GetYsRealPlayUrl: (cameraSn,channelNo,protocol,quality) => server.get(`/Monitor/RuntimeCamera/GetYsRealPlayUrl?cameraSn=${cameraSn}&channelNo=${channelNo}&protocol=${protocol}&quality=${quality}`),//
    GetYsHisPlayUrl: (cameraSn,channelNo,quality,startTime,stopTime) => server.get(`/Monitor/RuntimeCamera/GetYsHisPlayUrl?cameraSn=${cameraSn}&channelNo=${channelNo}&quality=${quality}&startTime=${startTime}&stopTime=${stopTime}`),//
    Overview: (data) => server.post(`/Monitor/RuntimeCamera/Overview`, data),//
    StartYsPtz: (data) => server.get(`/Monitor/RuntimeCamera/StartYsPtz?cameraSn=${data.cameraSn}&channelNo=${data.channelNo}&direction=${data.direction}&speed=${data.speed}`),//
    StopYsPtz: (data) => server.get(`/Monitor/RuntimeCamera/StopYsPtz?cameraSn=${data.cameraSn}&channelNo=${data.channelNo}&direction=${data.direction}`),//
  },
  //系统日志
  RuntimeLog:{
    QueryOperationLogs: (data) => server.post(`/Monitor/RuntimeLog/QueryOperationLogs`, data),//操作日志
    QueryDeviceLogs: (areaId,alike,data) => server.post(`/Monitor/RuntimeLog/QueryDeviceLogs?areaId=${areaId}&alike=${alike}`, data),//设备日志
  },
  //运行报告
  RuntimeReport:{
    QueryReport:(data) => server.get(`/Monitor/RuntimeReport/QueryReport?projectId=${data.projectId}&areaId=${data.areaId}&type=${data.type}&date=${data.date}`),//
  }
}
//运维管理(运行)
export class operation {
 static  AlarmCurrent = (data)=>server.get(`/Maintenance/MaintenanceRuntime/AlarmCurrent`,{params:data})//获取当前告警
 static  AlarmMonth = (data)=>server.get(`/Maintenance/MaintenanceRuntime/AlarmMonth`,{params:data})//获取本月告警
 static  MonthOrderStatistics =(data)=>server.get(`/Maintenance/MaintenanceRuntime/MonthOrderStatistics`,{params:data})//获取本月订单
 static  InspectionStatistics = (data)=>server.get(`/Maintenance/MaintenanceRuntime/InspectionStatistics`,{params:data})//巡检任务
 static  InspectionStatisticsTime = (params)=>server.post(`/Maintenance/MaintenanceRuntime/InspectionStatisticsTime`, params)//巡检任务
 static  MonthOrderTrend =(data)=>server.get(`/Maintenance/MaintenanceRuntime/MonthOrderTrend`,{params:data})//本月派单
 static  MonthAlarmTrend =(data)=>server.get(`/Maintenance/MaintenanceRuntime/MonthAlarmTrend`,{params:data})//本月告警事件
 static  AlarmPage=(data)=>server.post(`/Maintenance/MaintenanceRuntime/AlarmPage`,data)//告警信息
 static  DispachOrder=(data)=>server.get(`/Maintenance/MaintenanceRuntime/DispachOrder`,{params:data})//派单
 static  OrderPage=(data)=>server.post(`/Maintenance/MaintenanceRuntime/OrderPage`,data)//工单查询
 static  OrderStatistics=(data)=>server.post(`/Maintenance/MaintenanceRuntime/OrderStatistics`,data)//订单查询
 static  OrderDetail=(data)=>server.get(`/Maintenance/MaintenanceRuntime/OrderDetail`,{params:data})//工单详情
 static  InspectionPage=(data)=>server.post(`/Maintenance/MaintenanceRuntime/InspectionPage`,data)//巡检
 static  InspectionDetail=(data)=>server.get(`/Maintenance/MaintenanceRuntime/InspectionDetail`,{params:data})//巡检详细
 
}
//运维管理(设计)
export class operationDesigin{
  static QueryPageDevice = (data) => server.post(`/Maintenance/MaintenanceDesigner/QueryPageDevice`,data)//设备管理
  static InspectionPlanPage = (data) => server.post(`/Maintenance/MaintenanceDesigner/InspectionPlanPage`,data)//巡检计划
  static InsertInspectionPlan =(data) => server.post(`/Maintenance/MaintenanceDesigner/InsertInspectionPlan`,data)//新建巡检计划
  static QueryInspectionPlanAddress = (data) => server.post(`/Maintenance/MaintenanceDesigner/QueryInspectionPlanAddress`,data)//巡检点
  static QueryProjectMaintenance=(projectId) =>server.get(`/General/User/QueryProjectMaintenance?projectId=${projectId}`)//查询运维人员
  static DeleteInspectionPlan=(data)=>server.delete(`/Maintenance/MaintenanceDesigner/DeleteInspectionPlan`,{params:data})//删除巡检计划
  static QueryDeviceList=(data)=>server.get(`/Maintenance/MaintenanceDesigner/QueryDeviceList`,{params:data})//获取未选，已选设备
  static ConfigureDevice=(data)=>server.post(`/Maintenance/MaintenanceDesigner/ConfigureDevice`,data)//保存设备
  static ConfigureOneDevice=(data)=>server.post(`/Maintenance/MaintenanceDesigner/ConfigureOneDevice`,data)//编辑设备
  static RemoveOne=(data)=>server.delete(`/Maintenance/MaintenanceDesigner/RemoveOne`,{params:data})//移除已添加设备
  static QueryProjectMaintenanceArea=(data)=>server.get(`/General/User/QueryProjectMaintenanceArea`,{params:data})//查询巡检人
  static AddInspectionContent=(data)=>server.post(`/Maintenance/InspectionDesigner/AddInspectionContent`,data)//新增检查项
  static QueryPageInspectionContent=(data)=>server.post(`/Maintenance/InspectionDesigner/QueryPageInspectionContent`,data)//查询检查项
  static UpdateInspectionContent=(data)=>server.post(`/Maintenance/InspectionDesigner/UpdateInspectionContent`,data)//更新检查项
  static DeleteInspectionContent=(data)=>server.delete(`/Maintenance/InspectionDesigner/DeleteInspectionContent`,{params:data})//删除检查项
  static QueryInspectionAddressPage=(data)=>server.post(`/Maintenance/InspectionDesigner/QueryInspectionAddressPage`,data)//查询巡检点
  static InspectionQueryDeviceList=(data)=>server.post(`/Maintenance/InspectionDesigner/QueryDeviceList`,data)//巡检设备
  static QueryContentList=(data)=>server.post(`/Maintenance/InspectionDesigner/QueryContentList`,data)//巡检项
  static AddInspectionAddress=(data)=>server.post(`/Maintenance/InspectionDesigner/AddInspectionAddress`,data)//新增巡检项
  static DeleteInspectionAddress=(data)=>server.delete(`/Maintenance/InspectionDesigner/DeleteInspectionAddress`,{params:data})//删除巡检项
  static UpdateInspectionAddress=(data)=>server.post(`/Maintenance/InspectionDesigner/UpdateInspectionAddress`,data)//更新巡检点
  static InspectionAddressDetail=(data)=>server.get(`/Maintenance/InspectionDesigner/InspectionAddressDetail`,{params:data})//获取二维码
  static GetDuty=(data,areaId)=>server.get(`/Maintenance/DutyDesigner/GetDuty?projectId=${data}&areaId=${areaId}`)//获取班次
  static SetDuty=(data,projectId)=>server.post(`/Maintenance/DutyDesigner/SetDuty?projectId=${projectId}`,data)//设置班次
  static GetOperatorEx=(projectId,areaId)=>server.get(`/Maintenance/DutyDesigner/GetOperatorEx?projectId=${projectId}&areaId=${areaId}`)//获取排班人员
  static GetDutyUsers = (projectId,areaId)=>server.get(`/Maintenance/DutyDesigner/GetDutyUsers?projectId=${projectId}&areaId=${areaId}`)
  static EditDutyUser =(data,params)=>server.post(`/Maintenance/DutyDesigner/EditDutyUser`,data,{params})
  static SetDutyUser =(data,projectId,areaId)=>server.post(`/Maintenance/DutyDesigner/SetDutyUser?projectId=${projectId}&areaId=${areaId}`,data)//新增人员排班
  static SetDutyUsers =(data,projectId,areaId)=>server.post(`/Maintenance/DutyDesigner/SetDutyUsers?projectId=${projectId}&areaId=${areaId}`,data)//保存所有人排班信息
  static DeleteDutyUser =(projectId,userId,areaId)=>server.delete(`/Maintenance/DutyDesigner/DeleteDutyUser?projectId=${projectId}&userId=${userId}&areaId=${areaId}`)//删除排班人员

}
//电气安全(运行态)
export class safeElectric {
  static TodayWarningStatistics = (data) => server.get(`/Safe/SafeRuntime/QueryTodayWarningStatistics`, { params: data })//查询今日告警
  static QueryTodayWarningDetails = (data) => server.get(`/Safe/SafeRuntime/QueryTodayWarningDetails`, { params: data })//查询最新告警
  static QueryWarningDistributed = (data) => server.get(`/Safe/SafeRuntime/QueryWarningDistributed`, { params: data })//查询告警分布
  static QueryWarningTypeRanking = (data) => server.get(`/Safe/SafeRuntime/QueryWarningTypeRanking`, { params: data })//查询告警类型排名
  static QueryMonthWarningTrends = (data) => server.get(`/Safe/SafeRuntime/QueryMonthWarningTrends`, { params: data })//查询告警趋势
  static WarningDetailsPage = (data)=>server.post(`/Safe/SafeRuntime/WarningDetailsPage`,data)//查询分页告警
  static WarningDetailsList =(data)=>server.get(`/Safe/SafeRuntime/WarningDetailsList`,{ params: data })//查询告警列表
  static MonthReport =(data)=>server.get(`/Safe/SafeRuntime/MonthReport`,{ params: data })//月度报告
  static YearReport =(data)=>server.get(`/Safe/SafeRuntime/YearReport`,{ params: data})//年度报告
}
//告警详情
export class warnDetail {
  static QueryWarningStatistics=(data)=>server.get(`/Safe/SafeRuntime/QueryWarningStatistics`,{params:data})//查询告警数
  static QueryWarningDetails=(data)=>server.post(`/Safe/SafeRuntime/QueryWarningDetails`,data)//获取最新告警
}
//分类能耗
export class energyClassified {
  static QueryEnergy = (data, areaId) => server.post(`/Energy/EnergyClassifyRuntime/QueryEnergy`, areaId, { params: data })
  static QueryEnergyCost = (data, areaId) => server.post(`/Energy/EnergyClassifyRuntime/QueryEnergyCost`, areaId, { params: data })
}
//能耗排名
export class energyRanking {
  static AeraQueryAll = (projectId) => server.get(`/General/Area/QueryAll?projectId=${projectId}&level=1`)//获取区域
  static QueryShifts = (projectId) => server.get(`/Energy/EnergyShiftDesigner/QueryShifts?projectId=${projectId}`)//获取班次
  static Query = (data) => server.post(`/Energy/EnergyRankingRuntime/Query`, data)//能耗排名
}
//分时能耗
export class energyShare {
  static AeraQueryAll = (projectId) => server.get(`/General/Area/QueryAll?projectId=${projectId}&level=1`)//获取区域
  static QueryShifts = (projectId) => server.get(`/Energy/EnergyShiftDesigner/QueryShifts?projectId=${projectId}`)//获取班次
  static QuerySpaceTrees = (data) => server.get(`/Energy/EnergyQuotaDesigner/QuerySpaceTrees`, { params: data })//查询树
  static QueryElectric = (data) => server.post(`/Energy/EnergyTimeShareRuntime/QueryElectric`, data)//分时能耗

  static queryArea = (data, areaId) => server.post(`Energy/EnergyTimeShareRuntime/QueryElectricByArea?areaId=${areaId}`, data)//区域查询

  static queryLine = (data, areaId) => server.post(`Energy/EnergyTimeShareRuntime/QueryElectricByLine?areaId=${areaId}`, data)//线路查询
}
//数据报表
export class energyReport {
  static AeraQueryAll = (projectId) => server.get(`/General/Area/QueryAll?projectId=${projectId}&level=1`)//获取区域
  static QueryByArea = ({projectId, meterType, type, date, pageNum, pageSize, areaId}, params) =>
   server.post(`Energy/DataReportRuntime/QueryReadingByArea?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)// 实时抄表--区域
  static QueryByLine = ({projectId, meterType, type, date, pageNum, pageSize, areaId}, params) => 
  server.post(`Energy/DataReportRuntime/QueryReadingByLine?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)// 实时抄表--线路
  static QueryConsumeByArea = ({projectId, meterType, type, date, pageNum, pageSize,areaId}, params) => 
  server.post(`Energy/DataReportRuntime/QueryConsumeByArea?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)//能耗报表--区域

  static QueryConsumeByLine = ({projectId, meterType, type, date, pageNum, pageSize, areaId}, params) => 
  server.post(`Energy/DataReportRuntime/QueryConsumeByLine?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)//能耗报表--线路
  
  static QueryTimeConsumeByArea = ({projectId, meterType, type, date, pageNum, pageSize,areaId}, params) => 
  server.post(`Energy/DataReportRuntime/QueryTimeConsumeByArea?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)//分时能耗--区域

  static QueryTimeConsumeByLine = ({projectId, meterType, type, date, pageNum, pageSize, areaId}, params) => 
  server.post(`Energy/DataReportRuntime/QueryTimeConsumeByLine?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)//分时能耗--线路

  static QueryClassifyConsume = ({projectId, meterType, type, date, pageNum, pageSize,areaId}, params) => 
  server.post(`Energy/DataReportRuntime/QueryClassifyConsume?projectId=${projectId}&meterType=${meterType}&type=${type}&date=${date}&pageNum=${pageNum}&pageSize=${pageSize}&areaId=${areaId}`, params)//分类能耗
  // static QueryReading = (data, areaId) => server.post(`/Energy/DataReportRuntime/QueryReading`, areaId, { params: data })//能耗抄表
 // static QueryConsume = (data, areaId) => server.post(`/Energy/DataReportRuntime/QueryConsume`, areaId, { params: data })//能耗用量
  // static QueryTimeConsume = (data, areaId) => server.post(`/Energy/DataReportRuntime/QueryTimeConsume`, areaId, { params: data })//分时能耗
}
//energyDesigner能耗管理
export class energyDesigner {
  static queryElectricClassifys = (projectId, type) => server.get(`Energy/EnergyClassifyDesigner/QueryElectricClassifys?projectId=${projectId}&type=${type}`)
  //单个插入
  static insertEnergyClassify = (projectId, parentClassifyId, type, name) => server.get(`Energy/EnergyClassifyDesigner/InsertEnergyClassify?projectId=${projectId}&parentClassifyId=${parentClassifyId}&type=${type}&name=${name}`)
  static insertEnergyClassifys = (data) => server.post(`Energy/EnergyClassifyDesigner/InsertEnergyClassifys`, data)
  static updateEnergyClassify = (projectId, type, classifyId, name) => server.get(`Energy/EnergyClassifyDesigner/UpdateEnergyClassify?projectId=${projectId}&type=${type}&classifyId=${classifyId}&name=${name}`)
  static deleteEnergyClassify = (projectId, classifyId) => server.delete(`Energy/EnergyClassifyDesigner/DeleteEnergyClassify?projectId=${projectId}&classifyId=${classifyId}`)
  static queryEnergyConfigedDevicesInfo = (projectId, type, classifyId) => server.get(`Energy/EnergyClassifyDesigner/QueryEnergyConfigedDevicesInfo?projectId=${projectId}&type=${type}&classifyId=${classifyId}`)
  static queryEnergyNoConfigedDevices = (projectId, type) => server.get(`Energy/EnergyClassifyDesigner/QueryEnergyNoConfigedDevices?projectId=${projectId}&type=${type}`)
  static saveEnergyDevices = (projectId, type, classifyId, data) => server.post(`Energy/EnergyClassifyDesigner/SaveEnergyDevices?projectId=${projectId}&type=${type}&classifyId=${classifyId}`, data)
  static querOverview = (projectId, type, areaId, date) => server.post(`Energy/EnergyStreetLightRuntime/QuerOverview?projectId=${projectId}&type=${type}&areaId=${areaId}&date=${date}`)//查询路灯能耗概览
  static queryStreetLights = (projectId, content, areaId) => server.post(`Energy/EnergyStreetLightRuntime/QueryStreetLights?projectId=${projectId}&content=${content}&areaId=${areaId}`)//查询路灯列表
  static lineOn = (projectId, sn, lineNo) => server.post(`Energy/EnergyStreetLightRuntime/LineOn?projectId=${projectId}&sn=${sn}&lineNo=${lineNo}`)//手动开灯
  static lineOff = (projectId, sn, lineNo) => server.post(`Energy/EnergyStreetLightRuntime/LineOff?projectId=${projectId}&sn=${sn}&lineNo=${lineNo}`)//手动关灯
  static querOverviewLight = (projectId, type, areaId, date) => server.post(`Energy/EnergyPublicLightRuntime/QuerOverview?projectId=${projectId}&type=${type}&areaId=${areaId}&date=${date}`)//查询照明能耗概览
  static queryPublicLights = (projectId, content, areaId) => server.post(`Energy/EnergyPublicLightRuntime/QueryStreetLights?projectId=${projectId}&content=${content}&areaId=${areaId}`)//查询照明灯列表
  static lineOnLight = (projectId, sn, lineNo) => server.post(`Energy/EnergyPublicLightRuntime/LineOn?projectId=${projectId}&sn=${sn}&lineNo=${lineNo}`)//手动开灯（照明
  static lineOffLight = (projectId, sn, lineNo) => server.post(`Energy/EnergyPublicLightRuntime/LineOff?projectId=${projectId}&sn=${sn}&lineNo=${lineNo}`)//手动关灯（照明
}
//能源定价
export class energyPrice {
  static queryPriceSolutions = (projectId, areaId) =>
    server.get(
      `Energy/EnergyPriceDesigner/QueryPriceSolutions?projectId=${projectId}&areaId=${areaId}`
    );
  static insertPriceSolution = (projectId, data) =>
    server.post(
      `Energy/EnergyPriceDesigner/InsertPriceSolution?projectId=${projectId}`,
      data
    );
  static updatePriceSolution = (projectId, data) =>
    server.post(
      `Energy/EnergyPriceDesigner/UpdatePriceSolution?projectId=${projectId}`,
      data
    );
  static deletePriceSolution = (projectId, solutionId) =>
    server.get(
      `Energy/EnergyPriceDesigner/DeletePriceSolution?projectId=${projectId}&solutionId=${solutionId}`
    );
}
 
//能耗定额
export class energyQuota {
  static querySpaceTrees = (projectId, areaId, areaName) =>
    server.get(
      `Energy/EnergyQuotaDesigner/QuerySpaceTrees?projectId=${projectId}&areaId=${areaId}&areaName=${areaName}`
    );
  static queryRoomQuotas = (projectId, pageNum, pageSize, data) =>
    server.post(
      `Energy/EnergyQuotaDesigner/QueryRoomQuotas?projectId=${projectId}&pageNum=${pageNum}&pageSize=${pageSize}`,
      data
    );
  static updateRoomQuotas = (projectId, data) =>
    server.post(
      `Energy/EnergyQuotaDesigner/UpdateRoomQuotas?projectId=${projectId}`,
      data
    );
}
 
//能源结构
export class energyStructure {
  static queryEnergyStructure = (projectId, areaId, name) =>
    server.get(
      `Energy/EnergyStructureDesigner/QueryEnergyStructure?projectId=${projectId}&areaId=${areaId}&name=${name}`
    );
  static addEnergyStructure = (projectId, data) =>
    server.post(
      `Energy/EnergyStructureDesigner/AddEnergyStructure?projectId=${projectId}`,
      data
    );
  static updateEnergyStructure = (projectId, id, name) =>
    server.get(
      `Energy/EnergyStructureDesigner/UpdateEnergyStructure?projectId=${projectId}&id=${id}&name=${name}`
    );
  static deleteEnergyStructure = (projectId, id) =>
    server.delete(
      `Energy/EnergyStructureDesigner/DeleteEnergyStructure?projectId=${projectId}&id=${id}`
    );
  static configEnergyStructure = (projectId, data) =>
    server.post(
      `Energy/EnergyStructureDesigner/ConfigEnergyStructure?projectId=${projectId}`,
      data
    );
  static queryEnergyStructureConfig = (projectId, energyStructureId, areaId) =>
    server.get(
      `Energy/EnergyStructureDesigner/QueryEnergyStructureConfig?projectId=${projectId}&energyStructureId=${energyStructureId}&areaId=${areaId}`
    );
}
 
//班次管理
export class eneryShift {
  static queryShifts = (projectId) =>
    server.get(`Energy/EnergyShiftDesigner/QueryShifts?projectId=${projectId}`);
  static insertShift = (projectId, count, data) =>
    server.post(
      `Energy/EnergyShiftDesigner/InsertShift?projectId=${projectId}&count=${count}`,
      data
    );
  static updateShift = (projectId, data) =>
    server.post(
      `Energy/EnergyShiftDesigner/UpdateShift?projectId=${projectId}`,
      data
    );
  static deleteShift = (projectId) =>
    server.delete(
      `Energy/EnergyShiftDesigner/DeleteShift?projectId=${projectId}`
    );
}
 
export class distributionRoom {
  static queryPageRoom = (projectId, areaId, pageNum, pageSize) =>
    server.post(
      `Distribution/DistributionRoom/RoomPage`,{projectId, areaId, pageNum, pageSize}
    );
  static addRoom = (data) =>
    server.post(`Distribution/DistributionRoom/AddRoom`, data);
  static updateRoom = (data) =>
    server.post(`Distribution/DistributionRoom/UpdateRoom`, data);
  static deleteRoom = (projectId, id) =>
    server.delete(
      `Distribution/DistributionRoom/DeleteRoom?projectId=${projectId}&id=${id}`
    );
  static queryLine = (projectId, roomId) =>
    server.get(
      `Distribution/DistributionRoom/LineTree?projectId=${projectId}&roomId=${roomId}`
    );
  static addLine = (data) =>
    server.post(`Distribution/DistributionRoom/AddLine`, data);
  static updateLine = (projectId, id, name) =>
    server.get(
      `Distribution/DistributionRoom/UpdateLine?projectId=${projectId}&id=${id}&name=${name}`
    );
  static deleteLine = (projectId, id) =>
    server.delete(
      `Distribution/DistributionRoom/DeleteLine?projectId=${projectId}&id=${id}`
    );
  static queryUnusedLineMeter = (projectId, type, areaId) =>
    server.get(
      `Distribution/DistributionRoom/QueryUnusedLineMeter?projectId=${projectId}&type=${type}&areaId=${areaId}`
    );
  static configLineMeter = (data) =>
    server.post(`Distribution/DistributionRoom/ConfigureLineMeter`, data);
 // static queryPageChart = (projectId, areaId, roomId, pageNum, pageSize) => server.get(`Distribution/DistributionRoom/QueryPageChart?projectId=${projectId}&areaId=${areaId}&roomId=${roomId}&pageNum=${pageNum}&pageSize=${pageSize}`)
 static queryPageChart = (projectId, roomId, pageNum, pageSize) => server.post(`Distribution/DistributionRoom/ChartPage`,{projectId, roomId, pageNum, pageSize}) 
 static addChart = (data) => server.post(`Distribution/DistributionRoom/AddChart`, data)  
  static queryChart = (projectId, id) => server.get(`Distribution/DistributionRoom/ChartList?projectId=${projectId}&id= ${id}`)  
  static updateChart = (data) => server.post(`Distribution/DistributionRoom/UpdateChart`, data)  
  static deleteChart = (projectId, id) => server.delete(`Distribution/DistributionRoom/DeleteChart?projectId=${projectId}&id= ${id}`)  
  static RoomList =(projectId,areaId)=>server.get(`/Distribution/DistributionRoom/RoomList`,{params:{projectId,areaId}})
}
 
//配电房设备
export class DistributionMeter {
  //变压器
  static queryPageTransformer = (projectId, roomId, pageNum, pageSize) => server.get(`Distribution/DistributionMeter/QueryPageTransformer?projectId=${projectId}&roomId=${roomId}&pageNum=${pageNum}&pageSize=${pageSize}`);
  static queryUsedTransformer = (projectId, roomId) => server.get(`Distribution/DistributionMeter/QueryUsedTransformer?projectId=${projectId}&roomId=${roomId}`);
  static queryUnusedTransformer = (projectId, roomId) => server.get(`Distribution/DistributionMeter/QueryUnusedTransformer?projectId=${projectId}&roomId=${roomId}`);
  static configureTransformer = (data) => server.post(`Distribution/DistributionMeter/ConfigureTransformer`, data);
  //监控设备
  static queryPageCamera = (projectId, roomId, pageNum, pageSize) =>
    server.get(
      `Distribution/DistributionMeter/QueryPageCamera?projectId=${projectId}&roomId=${roomId}&pageNum=${pageNum}&pageSize=${pageSize}`
    );
  static queryUsedCamera = (projectId, roomId) =>
    server.get(
      `Distribution/DistributionMeter/QueryUsedCamera?projectId=${projectId}&roomId=${roomId}`
    );
  static queryUnusedCamera = (projectId, roomId) =>
    server.get(
      `Distribution/DistributionMeter/QueryUnusedCamera?projectId=${projectId}&roomId=${roomId}`
    );
  static configureCamera = (data) =>
    server.post(`Distribution/DistributionMeter/ConfigureCamera`, data);
  //传感器设备
  static queryPageSensor = (projectId, roomId, pageNum, pageSize) =>
    server.get(
      `Distribution/DistributionMeter/QueryPageSensor?projectId=${projectId}&roomId=${roomId}&pageNum=${pageNum}&pageSize=${pageSize}`
    );
  static queryUsedSensor = (projectId, roomId) =>
    server.get(
      `Distribution/DistributionMeter/QueryUsedSensor?projectId=${projectId}&roomId=${roomId}`
    );
  static queryUnusedSensor = (projectId, roomId) =>
    server.get(
      `Distribution/DistributionMeter/QueryUnusedSensor?projectId=${projectId}&roomId=${roomId}`
    );
  static configureSensor = (data) =>
    server.post(`Distribution/DistributionMeter/ConfigureSensor`, data);
}

export class DistributionRoomRuntime{
  static GetEnvironment =(projectId,roomId)=>{
    return  server.get(`/Distribution/DistributionRoomRuntime/GetEnvironment`,{params:{projectId,roomId}})
  };
  static TransformerList=(projectId,roomId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/TransformerList`,{params:{projectId,roomId}})
  }
  static ChartList=(projectId,roomId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/ChartList`,{params:{projectId,roomId}})
  }
  static  ChartDetails=(projectId,id)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/ChartDetails`,{params:{projectId,id}})
  }
  static TransformerList=(projectId,roomId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/TransformerList`,{params:{projectId,roomId}})
  }
  static RuntimePoints=(projectId,sn)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/RuntimePoints`,{params:{projectId,sn}})
  }
  static HistoryTrends=(data)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/HistoryTrends`,data)
  }
  static LineTree=(projectId,roomId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/LineTree`,{params:{projectId,roomId}})
  }
  static LineRuntimePoints=(projectId,roomId,lineId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/LineRuntimePoints`,{params:{projectId,roomId,lineId}})
  }
  static CameraSummary=(projectId,roomId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/CameraSummary`,{params:{projectId,roomId}})
  }
  static CameraPage=(data)=>{
    return server.post(`/Distribution/DistributionRoomRuntime/CameraPage`,data)
  }
  static GetEnvironment=(projectId,roomId)=>{
    return server.get(`/Distribution/DistributionRoomRuntime/GetEnvironment`,{params:{projectId,roomId}})
  }
}
//能源流向
export class EnergyFlowRuntime {
  static queryComprehensive = ({projectId, type, date}, data) =>
    server.post(
      `Energy/EnergyFlowRunTime/QueryComprehensive?projectId=${projectId}&type=${type}&date=${date}`,
      data
    );
  static queryElectric = ({projectId, type, date}, data) =>
    server.post(
      `Energy/EnergyFlowRunTime/QueryElectric?projectId=${projectId}&type=${type}&date=${date}`,
      data
    );
  static queryWater = ({projectId, type, date}, data) =>
    server.post(
      `Energy/EnergyFlowRunTime/QueryWater?projectId=${projectId}&type=${type}&date=${date}`,
      data
    );
  static queryGas = ({projectId, type, date}, data) =>
    server.post(
      `Energy/EnergyFlowRunTime/QueryGas?projectId=${projectId}&type=${type}&date=${date}`,
      data
    );
  // 拓扑图

  static QueryTopologyGatewayState = (projectId) =>  //查询网关状态
  server.post(
    `Energy/EnergyFlowRuntime/QueryTopologyGatewayState?projectId=${projectId}`   
  );
  
  static QueryTopologyGatewayCommports = ({projectId, gatewayId}) =>  //查询网关通道列表
  server.post(
    `Energy/EnergyFlowRuntime/QueryTopologyGatewayCommports?projectId=${projectId}&gatewayId=${gatewayId}`   
  );
  
  static QueryTopologyDeviceState = ({projectId, gatewayId,commport}) =>  //查询网关通道列表
  server.post(
    `Energy/EnergyFlowRuntime/QueryTopologyDeviceState?projectId=${projectId}&gatewayId=${gatewayId}&commport=${commport}`   
  );

}
 
//损耗分析
export class EnergyLossRuntime {
  static queryByLine = (pageNum, pageSize, data) =>
    server.post(
      `Energy/EnergyLossRunTime/QueryByLine?pageNum=${pageNum}&pageSize=${pageSize}`,
      data
    );
  static queryByBuilding = (pageNum, pageSize, data) =>
    server.post(
      `Energy/EnergyLossRunTime/QueryByBuilding?pageNum=${pageNum}&pageSize=${pageSize}`,
      data
    );
}
 
//定额能耗
export class EnergyQuotaRuntime {
  static queryQuotaOverview = (projectId, areaId) =>
    server.post(
      `Energy/EnergyQuotaRuntime/QueryQuotaOverview?projectId=${projectId}&areaId=${areaId}`
    );
  static queryRoomQuota = (projectId, areaId, roomName) =>
    server.post(
      `Energy/EnergyQuotaRuntime/QueryRoomQuota?projectId=${projectId}&areaId=${areaId}&roomName=${roomName}`
    );
  static queryQueryRoomDetail = (projectId, roomId, type) => server.post(`Energy/EnergyQuotaRuntime/QueryRoomDetail?projectId=${projectId}&roomId=${roomId}&type=${type}`);
}
//公共能耗
export class EnergyPublicRuntime {
  static queryEnergyCategoryTree = (projectId, categoryType) =>
    server.post(
      `Energy/EnergyPublicRuntime/QueryEnergyCategoryTree?projectId=${projectId}&categoryType=${categoryType}`
    );
  static queryElectricYear = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryElectric_Year?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryElectricDay = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryElectric_Day?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryElectricMonth = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryElectric_Month?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryWaterDay = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryWater_Day?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryWaterMonth = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryWater_Month?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryWaterYear = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryWater_Year?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryGasDay = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryGas_Day?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryGasMonth = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryGas_Month?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
  static queryGasYear = (projectId, areaId, date, shiftNo, data) =>
    server.post(
      `/Energy/EnergyPublicRuntime/QueryGas_Year?projectId=${projectId}&areaId=${areaId}&date=${date}&shiftNo=${shiftNo}`,
      data
    );
}
//储能概述
export class SiteSummaryRuntime {
  static querySiteInfo = (projectId, areaId, siteId) => server.get(`Storage/SiteSummaryRuntime/QuerySiteInfo?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
  static queryStorageIncome = (projectId, areaId, siteId) => server.get(`Storage/SiteSummaryRuntime/QueryStorageIncome?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
  static queryStorageWarning = (projectId, areaId, siteId) => server.get(`Storage/SiteSummaryRuntime/QueryStorageWarning?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
  static queryTopologyDiagramInfo = (projectId, areaId, siteId) => server.get(`Storage/SiteSummaryRuntime/QueryTopologyDiagramInfo?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
  static queryChargeETrends = (projectId, areaId, siteId) => server.get(`Storage/SiteSummaryRuntime/QueryChargeETrends?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
}
//储能告警信息
export class StorageAlarmRuntime {
  static alarmStatistic = (projectId, areaId, siteId) => server.get(`Storage/StorageAlarmRuntime/AlarmStatistics?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
  static QueryStorageAlarmByPage = (params={}) => server.post(`/Storage/StorageAlarmRuntime/QueryStorageAlarmByPage`, params);
}
 
//pcsMonitor
export class PCSMonitorRuntime {
  static queryPCSList = (projectId, areaId, siteId, containerId) => server.get(`Storage/PCSMonitorRuntime/QueryPCSList?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}&containerId=${containerId}`)
  static queryPCSInfo = (projectId, areaId, pcsId) => server.get(`Storage/PCSMonitorRuntime/QueryPCSInfo?projectId=${projectId}&areaId=${areaId}&pcsId=${pcsId}`)
  static queryPCSWarningInfo = (projectId, pcsId) => server.get(`Storage/PCSMonitorRuntime/QueryPCSWarningInfo?projectId=${projectId}&pcsId=${pcsId}`)
  static queryPowerTrends = (projectId, areaId, pcsId) => server.get(`Storage/PCSMonitorRuntime/QueryPowerTrends?projectId=${projectId}&areaId=${areaId}&pcsId=${pcsId}`)
  static querySocTrends = (projectId, areaId, pcsId) => server.get(`Storage/PCSMonitorRuntime/QuerySocTrends?projectId=${projectId}&areaId=${areaId}&pcsId=${pcsId}`)
  static queryAcTable = (projectId, areaId, pcsId) => server.get(`Storage/PCSMonitorRuntime/QueryAcTable?projectId=${projectId}&areaId=${areaId}&pcsId=${pcsId}`)
  static queryPileTable = (projectId, areaId, pcsId) => server.get(`Storage/PCSMonitorRuntime/QueryPileTable?projectId=${projectId}&areaId=${areaId}&pcsId=${pcsId}`)
}
 
// bmsRuntime
export class BMSRuntime {
  static queryBatterClusterList = (projectId, areaId) => server.get(`Storage/BMSRuntime/QueryBatteryClusterList?projectId=${projectId}&areaId=${areaId}`)
  static querySOCTrends = (projectId, areaId, bcId) => server.get(`Storage/BMSRuntime/QuerySOCTrends?projectId=${projectId}&areaId=${areaId}&bcId=${bcId}`)
  static queryVTrends = (projectId, areaId, bcId) => server.get(`Storage/BMSRuntime/QueryVTrends?projectId=${projectId}&areaId=${areaId}&bcId=${bcId}`)
  static queryITrends = (projectId, areaId, bcId) => server.get(`Storage/BMSRuntime/QueryITrends?projectId=${projectId}&areaId=${areaId}&bcId=${bcId}`)
  static queryBMSInfo = (projectId, areaId, bcId) => server.get(`Storage/BMSRuntime/QueryBMSInfo?projectId=${projectId}&areaId=${areaId}&bcId=${bcId}`)
  static queryEnvironmentInfo = (projectId, areaId, bcId) => server.get(`Storage/BMSRuntime/QueryEnvironmentInfo?projectId=${projectId}&areaId=${areaId}&bcId=${bcId}`)
  static queryBMSAlarms = (projectId, areaId, bcId) => server.get(`Storage/BMSRuntime/QueryBMSAlarms?projectId=${projectId}&areaId=${areaId}&bcId=${bcId}`)
  static queryBatteryPackInfo = (projectId, areaId, batteryPackId) => server.get(`Storage/BMSRuntime/QueryBatteryPackInfo?projectId=${projectId}&areaId=${areaId}&batteryPackId=${batteryPackId}`)
  static queryBatteryInfo = (areaId, batteryPackId, batteryNo, data) => server.post(`Storage/BMSRuntime/QueryBatteryInfo?areaId=${areaId}&batteryPackId=${batteryPackId}&batteryNo=${batteryNo}`, data)
  static queryBatteryWarning = (projectId, areaId, batteryPackId, data) => server.post(`Storage/BMSRuntime/QueryBatteryWarning?projectId=${projectId}&areaId=${areaId}&batteryPackId=${batteryPackId}`, data)
}
//告警管理
export class AlarmManagement {
  static QueryAlarmPage = (projectId, pageNum, pageSize) => server.get(`Safe/Alarm/QueryPlanPage?projectId=${projectId}&pageNum=${pageNum}&pageSize=${pageSize}`)
  static QueryAddAlarm = (data) => server.post(`Safe/Alarm/AddPlan`,data)
  static DeletePlanAlarm = (projectId,planId) => server.delete(`Safe/Alarm/DeletePlan?projectId=${projectId}&planId=${planId}`)
  static UpdatePlanAlarm = (data) => server.post(`Safe/Alarm/UpdatePlan`,data)
  static QueryAlarmEvents = (planId) => server.get(`Safe/Alarm/QueryAlarmEvents?planId=${planId}`)
  static AddAlarmEventInterval = (data) => server.post(`Safe/Alarm/AddAlarmEventInterval`,data)
  static AddAlarmEventOverrun = (data) => server.post(`Safe/Alarm/AddAlarmEventOverrun`,data)
  static AddAlarmEventDeflection = (data) => server.post(`Safe/Alarm/AddAlarmEventDeflection`,data)
  static AddAlarmEventSOE = (data) => server.post(`Safe/Alarm/AddAlarmEventSOE`,data)
  static AddAlarmEventCommunication = (data) => server.post(`Safe/Alarm/AddAlarmEventCommunication`,data)
  static DeleteAlarmEvent = (projectId,id) => server.delete(`Safe/Alarm/DeleteAlarmEvent?projectId=${projectId}&id=${id}`)
  static UpdateAlarmEventInterval = (data) => server.post(`Safe/Alarm/UpdateAlarmEventInterval`,data)
  static UpdateAlarmEventOverrun = (data) => server.post(`Safe/Alarm/UpdateAlarmEventOverrun`,data)
  static UpdateAlarmEventDeflection = (data) => server.post(`Safe/Alarm/UpdateAlarmEventDeflection`,data)
  static UpdateAlarmEventSOE = (data) => server.post(`Safe/Alarm/UpdateAlarmEventSOE`,data)
  static UpdateAlarmEventCommunication = (data) => server.post(`Safe/Alarm/UpdateAlarmEventCommunication`,data)
}
//储能--环境监控
export class StorageEnvironmentRuntime {
  static queryEnvironmentInfo = (projectId, areaId, siteId) => server.get(`/Storage/StorageEnvironmentRuntime/QueryEnvironmentInfo?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
  static queryTrends = (projectId, storageRoomId, date) => server.get(`/Storage/StorageEnvironmentRuntime/QueryTrends?projectId=${projectId}&storageRoomId=${storageRoomId}&date=${date}`)
}
 
//储能--收益统计
export class StorageRevenueRuntime {
  static QueryPrice = (projectId, areaId) => server.get(`/Storage/StorageRevenueRuntime/QueryPrice/?projectId=${projectId}&areaId=${areaId}`);
  static QueryRevenueReports = (stationName, params) => server.post(`/Storage/StorageRevenueRuntime/QueryRevenueReports?stationName=${stationName}`, params);
}
//储能设计-电价管理
export class StoragePriceDesigner {
  static QueryStoragePrice = (projectId, areaId) => server.get(`/Storage/StoragePriceDesigner/QueryStoragePrice?projectId=${projectId}&areaId=${areaId}`);
  static UpdateStoragePrice = (projectId, areaId, month, params={}) => server.post(`/Storage/StoragePriceDesigner/UpdateStoragePrice?projectId=${projectId}&areaId=${areaId}&month=${month}`, params);
}
export class StorageStrategyDesigner {
  static QueryStrategy = (projectId, areaId) => server.get(`/Storage/StorageStrategyDesigner/QueryStrategy?projectId=${projectId}&areaId=${areaId}`);
  static AddStrategy = (projectId, areaId, name) => server.post(`/Storage/StorageStrategyDesigner/AddStrategy?projectId=${projectId}&areaId=${areaId}&name=${name}`);
  static UpdateStrategy = (projectId, data) => server.post(`/Storage/StorageStrategyDesigner/UpdateStrategy?projectId=${projectId}`, data);
  static DeleteStrategy = (projectId, strategyId) => server.delete(`/Storage/StorageStrategyDesigner/DeleteStrategy?projectId=${projectId}&strategyId=${strategyId}`);
}
 
//站点管理
export class SiteManagerDesigner {
  static FindSiteList = (projectId, areaId) => server.get(`/Storage/SiteManagerDesigner/FindSiteList?projectId=${projectId}&areaId=${areaId}`);
  static GetSites = (projectId, PageNum, PageSize) => server.get(`/Storage/SiteManagerDesigner/GetSites?projectId=${projectId}&PageNum=${PageNum}&PageSize=${PageSize}`);
  static AddSite = (projectId, data) => server.post(`/Storage/SiteManagerDesigner/AddSite?projectId=${projectId}`, data);
  static UpdateSite = (projectId, data) => server.post(`/Storage/SiteManagerDesigner/UpdateSite?projectId=${projectId}`, data);
  static DeleteSite = (projectId, id) => server.delete(`/Storage/SiteManagerDesigner/DeleteSite?projectId=${projectId}&id=${id}`);
}
 
//电池管理
export class StorageMonitorRuntime {
  static QueryBatteryStackList = (projectId, areaId, siteId, containerId) => server.get(`/Storage/StorageMonitorRuntime/QueryBatteryStackList?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}&containerId=${containerId}`);
  static queryVTrends = (projectId,  stackId) => server.get(`/Storage/StorageMonitorRuntime/QueryVTrends?projectId=${projectId}&stackId=${stackId}`);
  static queryITrends = (projectId, stackId) => server.get(`/Storage/StorageMonitorRuntime/QueryITrends?projectId=${projectId}&stackId=${stackId}`);
  static querySOCTrends = (projectId, stackId) => server.get(`/Storage/StorageMonitorRuntime/QuerySOCTrends?projectId=${projectId}&stackId=${stackId}`);
  static queryBatteryStackInfo = (projectId, stackId) => server.get(`/Storage/StorageMonitorRuntime/QueryBatteryStackInfo?projectId=${projectId}&stackId=${stackId}`);
  static queryBatteryStackAlarms = (projectId, stackId) => server.get(`/Storage/StorageMonitorRuntime/QueryBatteryStackAlarms?projectId=${projectId}&stackId=${stackId}`);
  static queryBatteryStackStatus = (projectId, stackId) => server.get(`/Storage/StorageMonitorRuntime/QueryBatteryStackStatus?projectId=${projectId}&stackId=${stackId}`);
  static queryBatteryClusterInfo = (projectId, batteryClusterId) => server.get(`/Storage/StorageMonitorRuntime/QueryBatteryClusterInfo?projectId=${projectId}&batteryClusterId=${batteryClusterId}`);
  static queryBatteryPackInfo = (projectId, batteryClusterId) => server.get(`/Storage/StorageMonitorRuntime/QueryBatteryPackInfo?projectId=${projectId}&batteryClusterId=${batteryClusterId}`);
  static queryBatteryClusterWarning = (projectId, batteryClusterId) => server.post(`/Storage/StorageMonitorRuntime/QueryBatteryClusterWarning?projectId=${projectId}&batteryClusterId=${batteryClusterId}`);
  static queryBatteryWarning = (projectId, batteryId) => server.post(`/Storage/StorageMonitorRuntime/QueryBatteryWarning?projectId=${projectId}&batteryId=${batteryId}`)
  static queryContainersStacks = (projectId, areaId, siteId) => server.get(`/Storage/StorageMonitorRuntime/QueryContainersStacks?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}`)
}
//储能设备管理
export class StorageEquipmentDesigner {
  static QueryConfigInfo = (projectId, areaId, siteId, alike) => server.get(`/Storage/StorageEquipmentDesigner/QueryConfigInfo?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}&alike=${alike}`)
  static GetDeviceInfo = (projectId, siteId, alike) => server.get(`/Storage/StorageEquipmentDesigner/GetDeviceInfo?projectId=${projectId}&siteId=${siteId}&alike=${alike}`)
  static Config = (projectId, siteId, data) => server.post(`/Storage/StorageEquipmentDesigner/Config?projectId=${projectId}&siteId=${siteId}`,data)
  static Delete = (projectId, sn) => server.delete(`/Storage/StorageEquipmentDesigner/Delete?projectId=${projectId}&sn=${sn}`)
  static BatchConfig = (data) => server.post(`/Storage/StorageEquipmentDesigner/BatchConfig`, data)
  static QueryPcsByPage = (data) => server.post(`/Storage/StorageEquipmentDesigner/QueryPcsByPage`, data)
  static AddPcs = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/AddPcs?projectId=${projectId}`, data)
  static UpdatePcs = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/UpdatePcs?projectId=${projectId}`, data)
  static DeleteEquipment = (projectId, id, type) => server.delete(`/Storage/StorageEquipmentDesigner/DeleteEquipment?projectId=${projectId}&id=${id}&type=${type}`)
  static BatchImportPcs = (data) => server.post(`/Storage/StorageEquipmentDesigner/BatchImportPcs`, data)
  static QueryBatteryStackByPage = (data) => server.post(`/Storage/StorageEquipmentDesigner/QueryBatteryStackByPage`, data)
  static AddBatteryStack = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/AddBatteryStack?projectId=${projectId}`, data)
  static UpdateBatteryStack = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/UpdateBatteryStack?projectId=${projectId}`, data)
  static QueryBatteryClusterByPage = (data) => server.post(`/Storage/StorageEquipmentDesigner/QueryBatteryClusterByPage`, data)
  static AddBatteryCluster = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/AddBatteryCluster?projectId=${projectId}`, data)
  static UpdateBatteryCluster = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/UpdateBatteryCluster?projectId=${projectId}`, data)
  static QueryBatteryPackByPage = (data) => server.post(`/Storage/StorageEquipmentDesigner/QueryBatteryPackByPage`, data)
  static AddBatteryPack = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/AddBatteryPack?projectId=${projectId}`, data)
  static UpdateBatteryPack = (projectId, data) => server.post(`/Storage/StorageEquipmentDesigner/UpdateBatteryPack?projectId=${projectId}`, data)
  static QueryCategoryUsed = (projectId, style) => server.get(`/Storage/StorageEquipmentDesigner/QueryCategoryUsed?projectId=${projectId}&style=${style}`)
  static QueryClusterList = (projectId, areaId, siteId, containerId, stackId) => server.get(`/Storage/StorageEquipmentDesigner/QueryClusterList?projectId=${projectId}&areaId=${areaId}&siteId=${siteId}&containerId=${containerId}&stackId=${stackId}`)
  static BatchImportBatteryStack = (data) => server.post(`/Storage/StorageEquipmentDesigner/BatchImportBatteryStack`, data)
  static BatchImportBatteryCluster = (data) => server.post(`/Storage/StorageEquipmentDesigner/BatchImportBatteryCluster`, data)
  static BatchImportBatteryPack = (data) => server.post(`/Storage/StorageEquipmentDesigner/BatchImportBatteryPack`, data)
}
 
//环境监控设备
export class StorageMonitorDesigner {
  static QueryCategoryUsed = (projectId, style) => server.get(`/Storage/StorageMonitorDesigner/QueryCategoryUsed?projectId=${projectId}&style=${style}`)
  static QueryAirByPage = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/QueryAirByPage?projectId=${projectId}`, data)
  static AddAir = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/AddAir?projectId=${projectId}`, data)
  static UpdateAir = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/UpdateAir?projectId=${projectId}`, data)
  static BatchImportAir = (data) => server.post(`/Storage/StorageMonitorDesigner/BatchImportAir`, data)
  static QueryTHByPage = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/QueryTHByPage?projectId=${projectId}`, data)
  static AddTH = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/AddTH?projectId=${projectId}`, data)
  static UpdateTH = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/UpdateTH?projectId=${projectId}`, data)
  static BatchImportTH = (data) => server.post(`/Storage/StorageMonitorDesigner/BatchImportTH`, data)
  static QueryWByPage = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/QueryWByPage?projectId=${projectId}`, data)
  static AddW = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/AddW?projectId=${projectId}`, data)
  static UpdateW = (projectId, data) => server.post(`/Storage/StorageMonitorDesigner/UpdateW?projectId=${projectId}`, data)
  static BatchImportW = (data) => server.post(`/Storage/StorageMonitorDesigner/BatchImportW`, data)
  static Delete = (projectId, id, type) => server.delete(`/Storage/StorageMonitorDesigner/Delete?projectId=${projectId}&id=${id}&type=${type}`)
}

//首页概述
export class HomeRuntime {
  static GetProjectInfo = (projectId) => server.get(`/Home/HomeRuntime/GetProjectInfo?projectId=${projectId}`)//项目信息
  static GetChargeEByGrid = (projectId) => server.get(`/Home/HomeRuntime/GetChargeEByGrid?projectId=${projectId}`) //总充电量
  static GetCnFdUncharge = (projectId) => server.get(`/Home/HomeRuntime/GetCnFdUncharge?projectId=${projectId}`)//总放电量
  static GetChargeFee = (projectId) => server.get(`/Home/HomeRuntime/GetChargeFee?projectId=${projectId}`)//总充电金额
  static GetDayUnChargeIncome = (projectId) => server.get(`/Home/HomeRuntime/GetDayUnChargeIncome?projectId=${projectId}`)//储能日收益
  static GetCFETrends = (projectId) => server.get(`/Home/HomeRuntime/GetCFETrends?projectId=${projectId}`)//充放电趋势
  static GetUseETrends = (projectId) => server.get(`/Home/HomeRuntime/GetUseETrends?projectId=${projectId}`)//用电量
  static GetStorageTotalProfit = (projectId) => server.get(`/Home/HomeRuntime/GetStorageTotalProfit?projectId=${projectId}`)//储能总收益
  static GetStorageMonthProfit = (projectId) => server.get(`/Home/HomeRuntime/GetStorageMonthProfit?projectId=${projectId}`)//储能月收益
  static GetOrderInfo = (projectId) => server.get(`/Home/HomeRuntime/GetOrderInfo?projectId=${projectId}`)//工单信息
  static GetStorageProfitTrends = (projectId) => server.get(`/Home/HomeRuntime/GetStorageProfitTrends?projectId=${projectId}`)//储能收益统计
  static GetWarningDistribute = (projectId) => server.get(`/Home/HomeRuntime/GetWarningDistribute?projectId=${projectId}`)//告警分布
  static GetSiteSoc = (projectId) => server.get(`/Home/HomeRuntime/GetSiteSoc?projectId=${projectId}`)//站点Soc
}