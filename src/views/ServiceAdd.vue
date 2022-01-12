<template>
  <div id="d1">
    <fieldset
      class="layui-elem-field layui-field-title"
      style="margin-top: 20px"
    >
      <legend>创建新服务</legend>
    </fieldset>
    <el-form
      :model="addForm"
      :rules="rules"
      ref="addForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="类型">
        <el-select v-model="addForm.serType" placeholder="请选择类型">
          <el-option v-for="user in datalist" :key="user.dataValue" :value="user.dataValue" :label="user.dataType"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="客户">
        <el-select v-model="addForm.cusId" placeholder="请选择客户">
          <el-option v-for="user in cuslist" :key="user.cusId" :value="user.cusId" :label="user.cusName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建人" prop="uid">
        <el-input v-model="addForm.uid"></el-input>
      </el-form-item>

      <hr />
      <br />

      <el-form-item label="服务单标题" prop="serHead">
        <el-input v-model="addForm.serHead"></el-input>
      </el-form-item>
      <el-form-item label="服务单内容" prop="serDetail">
        <el-input type="textarea" v-model="addForm.serDetail"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="btn primary" @click="submitForm('addForm')"
          >立即创建</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datalist:[],
      cuslist:[],
      addForm: {
        serId: "",
        serType: "",
        typeName: "",
        cusId: "",
        cusName:"",
        uid: sessionStorage.getItem("user"),
        uname: "",
        serHead: "",
        serDetail: "",
        createTime: "",
        serStatus: "",
        distUid: "",
        distTime: "",
        serSatisfaction: ""
      },
      rules: {
        serType: [
           { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        cusId: [
           { required: true, message: '请选择客户', trigger: 'blur' },
        ],
        serHead: [
           { required: true, message: '请填写服务单标题', trigger: 'blur' },
        ],
        serDetail: [
           { required: true, message: '请填写服务单内容', trigger: 'blur' },
        ],
      },
    };
  },
  created(){
    this.$axios.post("datamanager/findAll")
    .then(res => {
      let r = res.data;
      this.datalist = r.data;
      console.log(r.data);
    });
    this.$axios.post("customer/findAll")
    .then(res => {
      let r = res.data;
      this.cuslist = r.data;
      console.log(r.data);
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addForm.createTime = this.fmt(new Date());
          this.addForm.serStatus = "新创建";
          this.addForm.serSatisfaction = null;
          this.save();
        } else {
          console.log("创建失败!!");
          return false;
        }
      });
    },
    save(){
      this.$axios.post("service/save", this.addForm).then(res=>{
        let r = res.data;
        console.log(r);
        if(r.code == 200){
          this.$message({
            message: "服务创建成功",
            type: "success"
          });
          this.$router.go(0);
        }
      })
      .catch(err=>{
        console.error(err);
      })
    },
    fmt(date){
      let yy = date.getFullYear();
          let MM = date.getMonth() + 1;
          MM = MM < 10 ? "0" + MM : MM;
          let dd = date.getDate();
          dd = dd < 10 ? "0" + dd : dd;
          let h = date.getHours();
          h = h < 10 ? "0" + h : h;
          let m = date.getMinutes();
          m = m < 10 ? "0" + m : m;
          let s = date.getSeconds();
          s = s < 10 ? "0" + s : s;
          return yy + "年" + MM + "月" + dd + "日" + " " + h + ":" + m + ":" + s;
    },
  },
};
</script>

<style scoped>
#d1 {
  width: 50%;
}
</style>