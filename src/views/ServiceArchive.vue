<template>
    <div>
      <h1>服务归档</h1>
      <hr>
      <div class="layui-tab">
        <ul class="layui-tab-title">
            <li class="layui-this" lay-id="11" ><router-link to="/Home/ServiceArchive/ServiceArchiveList">已归档服务及归档单查看</router-link></li>
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