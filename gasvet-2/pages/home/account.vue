<template>
  <div class="pages">
    <div class="account-center">
      <aside class="left">
        <div class="title-2">
         <span><i class="fas fa-user navbar-icons cl-f navbar-icons"/>ADMİN</span>
        </div>
        <div class="left-con">
          <div class="left-wrap">
            <!-- boss side -->
              <section v-if="checkB1">
                <span class="title-3">Boss</span>
                <nuxt-link to="/home/account/boss" class="title-list account-list" exact-active-class="account-active">
                  <i class="fas fa-user title-list-icon cl-g"/>
                  <span>Panel</span>
                </nuxt-link>
              </section>
            <!-- user and admin side -->
            <section v-if="!checkS1">
              <span class="title-3">Kupon İşlemleri</span>
              <nuxt-link to="/home/account" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-tachometer-alt title-list-icon cl-y"/>
                <span>Kuponlar</span>
              </nuxt-link>
              <nuxt-link to="/home/account/singelbets" v-if="!checkS1" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-arrow-down title-list-icon cl-y"/>
                <span>Tek Maça Kalanlar</span>
              </nuxt-link>
              <nuxt-link to="/home/account/nextgoals" v-if="!checkS1" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-arrow-up title-list-icon cl-y"/>
                <span>Sıradaki Goller</span>
              </nuxt-link>
              <nuxt-link v-if="checkA1" to="/home/account/paycupons" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-money-bill-alt title-list-icon cl-y"/>
                <span>Kupon Ödeme</span>
              </nuxt-link>
            </section>
              <section v-if="checkC1 || checkU1 || checkG1 || checkA1">
                <nuxt-link to="/home/account/historybet" class="title-list account-list" exact-active-class="account-active">
                  <i class="fas fa-arrow-left title-list-icon cl-y"/>
                  <span>Geçmis Kuponlar</span>
                </nuxt-link>
                <nuxt-link to="/home/account/historyreport" class="title-list account-list" exact-active-class="account-active">
                  <i class="fas fa-chart-pie title-list-icon cl-y"/>
                  <span>Geçmis Kupon Raporu</span>
                </nuxt-link>
              </section>
          <!-- not user side -->
            <section v-if="!checkU1 && !checkC1">
              <span class="title-3">Üye İşlemleri</span>
              <nuxt-link to="/home/account/users" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-users title-list-icon cl-g"/>
                <span>Üyeler</span>
              </nuxt-link>
              <nuxt-link to="/home/account/register" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-user-plus title-list-icon cl-g"/>
                <span>Üye Ekle</span>
              </nuxt-link>
            </section>
            <span class="title-3">Profil</span>
            <nuxt-link to="/home/account/profile" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-user-circle title-list-icon cl-u mr15"/>
              <span>Profil</span>
            </nuxt-link>
            <span class="title-3">Raporlar</span>
            <nuxt-link to="/home/account/detailsaccount" v-if="!checkS1 && !checkB1" class="title-list account-list" exact-active-class="account-active">
              <i class="fas fa-chart-line title-list-icon cl-s"/>
              <span>Kupon Raporu</span>
            </nuxt-link>
            <nuxt-link to="/home/account/creditlog" v-if="!checkS1 && !checkB1" class="title-list account-list" exact-active-class="account-active"> 
              <i class="fas fa-chart-line title-list-icon cl-s"/>
              <span>Bakiye Raporu</span>
            </nuxt-link>
            <nuxt-link to="/home/account/gamelog" v-if="!checkS1 && !checkB1" class="title-list account-list" exact-active-class="account-active"> 
              <i class="fas fa-chart-line title-list-icon cl-s"/>
              <span>Oyun Raporu</span>
            </nuxt-link>
            <nuxt-link to="/home/account/loginlog" class="title-list account-list" exact-active-class="account-active"> 
              <i class="fas fa-chart-line title-list-icon cl-s"/>
              <span>Giriş/Çıkış Raporu</span>
            </nuxt-link>
            <section v-if="checkU1 || checkC1 || checkA1 || checkG1">
              <span class="title-3">Hesap İşlemleri</span>
              <nuxt-link to="/home/account/detailscomission" v-if="checkG1 || checkU1" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-chart-bar title-list-icon cl-h"/>
                <span>Komisyon Detayı</span>
              </nuxt-link>
              <nuxt-link to="/home/account/resetaccount" v-if="!checkC1" class="title-list account-list" exact-active-class="account-active">
                <i class="fas fa-briefcase title-list-icon cl-h"/>
                <span>Hesap Kesimi</span>
              </nuxt-link>
            </section>
            <!-- admin side -->
            <section v-if="checkA1">
              <span class="title-3">Sistem Ayarları</span>
              <nuxt-link to="/home/account/generalset" class="title-list account-list" exact-active-class="account-active"> 
                <i class="fas fa-user title-list-icon cl-y"/>
                <span>Sistem Genel Ayarları</span>
              </nuxt-link>
              <nuxt-link to="/home/account/settime" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-clock title-list-icon cl-y"/>
                <span>Sistem Zaman Ayarları</span>
              </nuxt-link>
              <nuxt-link to="/home/account/setlimit" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-key title-list-icon cl-y"/>
                <span>Sistem Limit Ayarları</span>
              </nuxt-link>            
              <span class="title-3">Spor Ayarları</span>
              <nuxt-link to="/home/account/branch" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon cl-g"/>
                <span>Branş Düzenle</span>
              </nuxt-link>
              <span class="title-3">Futbol Ayarları</span>
              <nuxt-link to="/home/account/soccermarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon cl-g"/>
                <span>Bülten Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerrate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon cl-g"/>
                <span>Bülten Oran Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerinplaymarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon cl-y mr15"/>
                <span>Canlı Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/soccerliverate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon cl-y mr15"/>
                <span>Canlı Oran Düzenle</span>
              </nuxt-link>
              <span class="title-3">Basketbol Ayarları</span>
              <nuxt-link to="/home/account/basketmarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon cl-o"/>
                <span>Bülten Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketrate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-cog title-list-icon cl-o"/>
                <span>Bülten Oran Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketinplaymarkets" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon cl-y mr15"/>
                <span>Canlı Bahis Düzenle</span>
              </nuxt-link>
              <nuxt-link to="/home/account/basketliverate" class="title-list account-list" exact-active-class="settings-active">
                <i class="fas fa-bolt title-list-icon cl-y mr15"/>
                <span>Canlı Oran Düzenle</span>
              </nuxt-link>
            </section>
            <span class="title-3">Kurallar</span>
            <nuxt-link to="/home/account/info" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-info title-list-icon cl-y"/>
              <span>Bahis Kuralları</span>
            </nuxt-link>
            <nuxt-link to="/home/account/codelist" class="title-list account-list" exact-active-class="settings-active">
              <i class="fas fa-info title-list-icon cl-y"/>
              <span>Bülten Kod Listesi</span>
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
  computed:{
    checkC1 () {
      if (this.$store.state.auth.role === 'C1') {
        return true
      }
    },
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkG1 () {
      if (this.$store.state.auth.role === 'G1') {
        return true
      }
    },
    checkA1 () {
      if (this.$store.state.auth.role === 'A1') {
        return true
      }
    },
    checkS1 () {
      if (this.$store.state.auth.role === 'S1') {
        return true
      }
    },
    checkB1 () {
      if (this.$store.state.auth.role === 'B1') {
        return true
      }
    }
  }
}
</script>