<template>
  <div>
      <h1>服务创建</h1>
      <hr>
      <div class="layui-tab">
        <ul class="layui-tab-title">
           <li lay-id="11" class="layui-this" ><router-link to="/Home/Service/ServiceAdd">服务创建</router-link></li>
           <li lay-id="22" ><router-link to="/Home/Service/ServiceList">服务列表</router-link></li>
           
        </ul>
        <div class="layui-tab-content">
            <router-view></router-view>
        </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>