<template>
  <div>
      <form action="">
          username: <input type="text" v-model="username"> <br>
          password: <input type="text" v-model="password"> <br>
          <button type="button" @click="login">登录</button>
      </form>
  </div>
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
                    this.$router.push("/Users");
                    return;
                }
                this.username = this.password = '';
                alert("认证失败");
            });
        }
    }
}
</script>

<style>

</style>