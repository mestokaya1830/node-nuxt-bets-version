<template>
  <div class="pages">
    <div class="account-center">
      <aside class="left">
        <div class="title-2">
         <span class="account-sidebar-title">Admin</span>
        </div>
        <div class="left-con">
          <div class="left-wrap">
            <!-- boss side -->
              <section v-if="checkBoss">
                <span class="account-sidebar-title">Boss</span>
                <nuxt-link to="/home/account/boss" class="title-list account-list" exact-active-class="account-active">
                  <i class="fas fa-user title-list-icon"/>
                  <span class="account-sidebar-title">Panel</span>
                </nuxt-link>
              </section>
            <!-- user and admin side -->
            <section v-if="!checkSuperadmin">
              <span class="title-3">Kupon İşlemleri</span>
              <nuxt-link to="/home/account" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-tachometer-alt title-list-icon"/>
                <span>Kuponlar</span>
              </nuxt-link>
              <nuxt-link v-if="!checkSuperadmin" to="/home/account/singelbets" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-arrow-down title-list-icon"/>
                <span>Tek Maça Kalanlar</span>
              </nuxt-link>
              <nuxt-link v-if="!checkSuperadmin" to="/home/account/nextgoals" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-arrow-up title-list-icon"/>
                <span>Sıradaki Goller</span>
              </nuxt-link>
              <nuxt-link v-if="checkAdmin" to="/home/account/paycupons" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-money-bill-alt title-list-icon"/>
                <span>Kupon Ödeme</span>
              </nuxt-link>
            </section>
          <!-- not user side -->
            <section v-if="!checkMember && !checkSubmember">
              <span class="title-3">Üye İşlemleri</span>
              <nuxt-link to="/home/account/users" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-users title-list-icon"/>
                <span>Üyeler</span>
              </nuxt-link>
              <nuxt-link to="/home/account/register" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-user-plus title-list-icon"/>
                <span>Üye Ekle</span>
              </nuxt-link>
            </section>
            <span class="title-3">Profil</span>
            <nuxt-link to="/home/account/profile" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-user-circle title-list-icon"/>
              <span>Profil</span>
            </nuxt-link>
            <span class="title-3">Raporlar</span>
            <div v-if="!checkSuperadmin && !checkBoss">
              <nuxt-link to="/home/account/detailsaccount" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-chart-line title-list-icon"/>
                <span>Kupon Raporu</span>
              </nuxt-link>
              <nuxt-link to="/home/account/creditlog" class="title-list account-list" exact-active-class="account-active"> 
                <i class="fas fa-chart-line title-list-icon"/>
                <span>Bakiye Raporu</span>
              </nuxt-link>
              <nuxt-link to="/home/account/gamelog" class="title-list account-list" exact-active-class="account-active"> 
                <i class="fas fa-chart-line title-list-icon"/>
                <span>Oyun Raporu</span>
              </nuxt-link>
            </div>
            <nuxt-link to="/home/account/loginlog" class="title-list account-list" exact-active-class="account-active"> 
              <i class="fas fa-chart-line title-list-icon"/>
              <span>Giriş/Çıkış Raporu</span>
            </nuxt-link>
            <section v-if="checkAdmin || checkSubadmin || checkMember || checkSubmember">
              <span class="title-3">Hesap İşlemleri</span>
              <nuxt-link to="/home/account/detailscomission" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-chart-bar title-list-icon"/>
                <span>Komisyon Detayı</span>
              </nuxt-link>
            </section>
            <!-- admin side -->
            <section v-if="checkAdmin">
              <span class="title-3">Sistem Ayarları</span>
              <nuxt-link to="/home/account/generalset" class="title-list account-list" exact-active-class="account-active"> 
                <i class="fas fa-user title-list-icon"/>
                <span>Sistem Genel Ayarları</span>
              </nuxt-link>
              <nuxt-link to="/home/account/settime" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-clock title-list-icon"/>
                <span>Sistem Zaman Ayarları</span>
              </nuxt-link>
              <nuxt-link to="/home/account/setlimit" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-key title-list-icon"/>
                <span>Sistem Limit Ayarları</span>
              </nuxt-link>            
              <span class="title-3">Spor Ayarları</span>
              <nuxt-link to="/home/account/branch" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon"/>
                <span>Branş Düzenle</span>
              </nuxt-link>
              <span class="title-3">Futbol Ayarları</span>
              <nuxt-link to="/home/account/soccermarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon"/>
                <span>Bülten Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerrate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon"/>
                <span>Bülten Oran Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerinplaymarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon"/>
                <span>Canlı Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerliverate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon"/>
                <span>Canlı Oran Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerratelimit" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon"/>
                <span>Oran Sınırlama</span>
              </nuxt-link>
              <span class="title-3">Basketbol Ayarları</span>
              <nuxt-link to="/home/account/basketmarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon"/>
                <span>Bülten Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketrate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon"/>
                <span>Bülten Oran Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketinplaymarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon"/>
                <span>Canlı Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketliverate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon"/>
                <span>Canlı Oran Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketratelimit" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon"/>
                <span>Oran Sınrlama</span>
              </nuxt-link>
            </section>
            <span class="title-3">Kurallar</span>
            <nuxt-link to="/home/account/info" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-info title-list-icon"/>
              <span>Bahis Kuralları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/codelist" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-info title-list-icon"/>
              <span>Bülten Kod Listesi</span>
            </nuxt-link>
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
  name: "Account",
  computed:{
    checkSubmember () {
      if (this.$store.state.auth.role === 'Submember') {
        return true
      }
    },
    checkMember () {
      if (this.$store.state.auth.role === 'Member') {
        return true
      }
    },
    checkSubadmin () {
      if (this.$store.state.auth.role === 'Subadmin') {
        return true
      }
    },
    checkAdmin () {
      if (this.$store.state.auth.role === 'Admin') {
        return true
      }
    },
    checkSuperadmin () {
      if (this.$store.state.auth.role === 'Superadmin') {
        return true
      }
    },
    checkBoss () {
      if (this.$store.state.auth.role === 'Boss') {
        return true
      }
    }
  }
}
</script>