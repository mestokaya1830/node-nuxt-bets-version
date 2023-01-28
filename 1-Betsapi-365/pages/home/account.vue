<template>
  <div class="pages">
    <div class="account-center">
      <aside class="left">
        <div class="title-2">
         <span><i class="fas fa-user navbar-icons cl-g navbar-icons"/>ADMİN</span>
        </div>
        <div class="left-con">
          <div class="left-wrap">
            <div v-if="checkU1 || checkA2">
              <span class="title-3">Kupon İşlemleri</span>
              <nuxt-link to="/home/account" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-tachometer-alt title-list-icon cl-y"/>
                <span>Kuponlar</span>
              </nuxt-link>
              <nuxt-link to="/home/account/betinspect" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-chart-line title-list-icon cl-y"/>
                <span>Kupon Aylık Analiz</span>
              </nuxt-link>
              <nuxt-link to="/home/account/monthlyreport" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-chart-pie title-list-icon cl-y"/>
                <span>Kupon Aylık Rapor</span>
              </nuxt-link>
            </div>  
            <span class="title-3">Üye İşlemleri</span>
            <nuxt-link to="/home/account/users" v-if="!checkU1" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-users title-list-icon cl-u"/>
              <span>Üyeler</span>
            </nuxt-link>
            <nuxt-link to="/home/account/register" v-if="!checkU1" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-user-plus title-list-icon cl-u"/>
              <span>Üye Ekle</span>
            </nuxt-link>
            <nuxt-link to="/home/account/profile" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-user-circle title-list-icon cl-u mr15"/>
              <span>Profil</span>
            </nuxt-link>
            <span class="title-3" v-if="checkU1 || checkA2">Hesap İşlemleri</span>
            <nuxt-link to="/home/account/detailsaccount" v-if="checkU1 || checkA2" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-chart-bar title-list-icon cl-h"/>
              <span>Hesap Detayı</span>
            </nuxt-link>
            <nuxt-link to="/home/account/resetaccount" v-if="checkU1 || checkA2" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-briefcase title-list-icon cl-h"/>
              <span>Hesap Kesimi</span>
            </nuxt-link>
            <span class="title-3">Geçmiş İşlemleri</span>
            <nuxt-link to="/home/account/creditlog" v-if="checkU1 || checkA2" class="title-list account-list" exact-active-class="account-active"> 
              <i class="fas fa-credit-card title-list-icon cl-s"/>
              <span>Kredi Geçmişi</span>
            </nuxt-link>
            <nuxt-link to="/home/account/loginlog" class="title-list account-list" exact-active-class="account-active"> 
              <i class="fas fa-arrows-alt-h title-list-icon cl-s"/>
              <span>İşlem Geçmişi</span>
            </nuxt-link>
            <span class="title-3" v-if="checkA2">Zaman İşlemleri</span>
            <nuxt-link to="/home/account/timesettings" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-clock title-list-icon cl-z"/>
              <span>Zaman Ayarları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/limitsettings" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-key title-list-icon cl-z"/>
              <span>Limit Ayarları</span>
            </nuxt-link>
            <span class="title-3" v-if="checkA2">Bülten İşlemleri</span>
            <nuxt-link to="/home/account/leagues" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-wrench title-list-icon cl-b"/>
              <span>Bülten Lig Ayarları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/markets" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-wrench title-list-icon cl-b"/>
              <span>Bülten Bahis Ayarları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/rate" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-wrench title-list-icon cl-b"/>
              <span>Bülten Oran Ayarları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/codelist" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-wrench title-list-icon cl-b"/>
              <span>Bülten Kod Listesi</span>
            </nuxt-link>
            <span class="title-3" v-if="checkA2">Canlı İşlemleri</span>
            <nuxt-link to="/home/account/liveleagues" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-cog title-list-icon cl-c"/>
              <span>Canlı Lig Ayarları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/livemarkets" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-cog title-list-icon cl-c"/>
              <span>Canlı Bahis Ayarları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/liverate" v-if="checkA2" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-cog title-list-icon cl-c"/>
              <span>Canlı Oran Ayarları</span>
            </nuxt-link>
            <div class="page-end">Başka veri yoktur</div>
          </div>
        </div>
      </aside>
      <aside class="account-router">
        <nuxt />
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: "account",
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkA2 () {
      if (this.$store.state.auth.role === 'A2') {
        return true
      }
    },
    checkS3 () {
      if (this.$store.state.auth.role === 'S3') {
        return true
      }
    },
    checkB4 () {
      if (this.$store.state.auth.role === 'B4') {
        return true
      }
    }
  }
}
</script>