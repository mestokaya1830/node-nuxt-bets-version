<template>
  <div>
    <div class="alert bg-gr">{{ message }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Alert',
    props: {
      message: {
        type: String,
        required: true,
        default: ''
      } 
    }
  }
</script>

