<template>
  <div>
    <div class="alert bg-g">{{ message }}</div>
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

