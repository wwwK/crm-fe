<template>
  <div>
      UsersUI
      <button @click="f1">save</button>
      <button @click="f2">delete</button>
  </div>
</template>

<script>
export default {
    methods:{
        f1(){
            this.$axios.get("users/save", {id:1});
        },
        f2(){
            this.$axios.post("users/delete");
        }
    }
}
</script>

<style>

</style>