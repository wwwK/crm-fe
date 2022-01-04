<template>
<form class="layui-form" action="">
    <div class="container">
        <div class="layui-form-mid layui-word-aux" style="margin:10px 70px" >
             <h1>客户关系管理系统</h1>				
        </div>
        <div class="layui-form-item">
        <label class="layui-form-label">用户名</label>
        <div class="layui-input-block">
            <input type="text"   placeholder="请输入用户名" class="layui-input" v-model="username">
        </div>
        </div>
        <div class="layui-form-item">
        <label class="layui-form-label">密 &nbsp;&nbsp;码</label>
        <div class="layui-input-inline">
            <input type="password"  placeholder="请输入密码" class="layui-input" v-model="password">
        </div>
        </div>
        <div class="layui-form-item">
        <div class="layui-input-block">
            <button type="button" class="layui-btn"  @click="login">登陆</button>	     
        </div>
        </div>
    </div>
</form>
</template>

<script>
export default {
    data() {
        return {
            "username": '',
            "password": ''
        };
    },
    methods:{
        login(){
            this.$axios.post("auth/login",{username:this.username,password:this.password}).then((response) => {
                let r = response.data;
                if (r.code == 200) {
                    console.log("!!!!!");
                    sessionStorage.setItem("user","ok");
                    this.$router.push("/Home");
                    return;
                }
                this.username = this.password = '';
                alert("认证失败");
            });
        }
    }
}
</script>

<style scoped>
.container{
    width: 420px;
    height: 320px;
        min-height: 320px;  
        max-height: 320px;  
        position: absolute;   
        top: 0;  
        left: 0;  
        bottom: 0;  
        right: 0;  
        margin: auto;  
        padding: 20px;  
        z-index: 130;  
        border-radius: 8px;  
        background-color: #fff;  
        box-shadow: 0 3px 18px rgba(100, 0, 0, .5); 
        font-size: 16px;
}

.layui-input{
    border-radius: 5px;
    width: 300px;
    height: 40px;
    font-size: 15px;
}
.layui-form-item{
    margin-top: 40px;
    margin-left: -20px;
}

.layui-btn{
    margin-left: -50px;
    border-radius: 5px;
    width: 350px;
    height: 40px;
    font-size: 15px;
}



</style>