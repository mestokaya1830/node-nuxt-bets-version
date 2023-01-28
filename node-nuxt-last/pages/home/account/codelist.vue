<template>
  <div class="pages">
    <header class="title-2">
      <span class="set-title">Kod Listesi</span>
    </header>
    <ul>
      <div class="code-list">
        <section class="user-id-section">
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">B</span>Beraberlikte İade</span> <span class="badge bg-f">g1,g2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">Ç</span>Çifte Şans</span> <span class="badge bg-f">c10,c02,c12</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">E</span>Evsahibi Gol Alt/Üst</span> <span class="badge bg-f">ht11, ht12, ht21, ht22</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">E</span>Evsahibi Gol Atarmı</span> <span class="badge bg-f">hg1,hg2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">E</span>Evsahibi Devre Gol</span> <span class="badge bg-f">hts1,hts0,hts2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">E</span>Evsahibi Her İki Devre Gol</span> <span class="badge bg-f">hgdv1,hgdv2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">D</span>Deplasman Gol Alt/Üst</span> <span class="badge bg-f">at11, at12, at21, at22</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">D</span>Deplasman Gol Atarmı</span> <span class="badge bg-f">ag1,ag2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">D</span>Deplasman Devre Gol</span> <span class="badge bg-f">ats1,ats0,ats2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">H</span>Handikap 0:1</span> <span class="badge bg-f">h011,h010,h012</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">H</span>Handikap 1:0</span> <span class="badge bg-f">h101,h101,h102</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">H</span>Handikap 0:2</span> <span class="badge bg-f">h021,h020,h022</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">H</span>Handikap 2:0</span> <span class="badge bg-f">h201,h200,h202</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">H</span>Hangi Devre Çok Gol Olur</span> <span class="badge bg-f">a1,a0,a2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Bahsi</span> <span class="badge bg-f">d1, d0, d2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı ve Maç Bahsi</span> <span class="badge bg-f">dv11,dv10,dv12,dv00,dv01,dv02,dv21,dv20,dv22</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Karşılıklı Gol</span> <span class="badge bg-f">dbb1,dbb2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Evsahibi Gol Alt/Üst</span> <span class="badge bg-f">hdt01,hdt02,hdt11,hdt12</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Deplasman Gol Alt/Üst</span> <span class="badge bg-f">adt01, adt02, adt11, adt12</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Toplam Gol Aralığı (0-2)</span> <span class="badge bg-f">dtga20,dtga21,dtga22</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Toplam Gol Aralığı (0-3)</span> <span class="badge bg-f">dtga30,dtga31,dtga32</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Çifte Şans</span> <span class="badge bg-f">dc10,dc02,dc12</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Toplam Gol Alt/Üst</span> <span class="badge bg-f">dt01, dt02, dt11, dt12, dt21, dt22, dt31, dt32</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Gol Sayısı</span> <span class="badge bg-f">dtg0,dtg1,dtg2,dtg3</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Evsahibi Gol Sayısı</span> <span class="badge bg-f">hdtg0,hdtg1,hdtg2,hdtg3</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İlk Yarı Deplasman Gol Sayısı</span> <span class="badge bg-f">adtg0,adtg1,adtg2,adtg3</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İK</span>İkinci Yarı Toplam Gol Alt/Üst</span> <span class="badge bg-f">vt01, vt02, vt11, vt12, vt21, vt22, vt31, vt32, vt41, vt42</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İK</span>İkinci Yarı Gol Sayısı</span> <span class="badge bg-f">vtg0,vtg1,vtg2,vtg3</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İK</span>İkinci Yarı Evsahibi Gol Sayısı</span> <span class="badge bg-f">hvtg0,hvtg1,hvtg2,hvtg3</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">İL</span>İkinci Yarı Deplasman Gol Sayısı</span> <span class="badge bg-f">avtg0,avtg1,avtg2,avtg3</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">K</span>Karşılıklı Gol</span> <span class="badge bg-f">bb1,bb2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">M</span>Maç Bahsi</span><span class="badge bg-f">1, 0, 2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">M</span>Maç Bahsi ve Karşılıklı Gol</span><span class="badge bg-f">mbb11, mbb12, mbb21, mbb22, mbb01,mbb02</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">M</span>Maç Bahsi ve Toplam Gol Alt/Üst 2.5</span> <span class="badge bg-f">mt212,mt222,mt211,mt221,mt20</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">M</span>Maç Bahsi ve Toplam Gol Alt/Üst 3.5</span> <span class="badge bg-f">mt312,mt322,mt311,mt321,mt30</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Takımlardan Biri 1 Farkla Kazanırmı</span> <span class="badge bg-f">tb11,tb12</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Takımlardan Biri 2 Farkla Kazanırmı</span> <span class="badge bg-f">tb21,tb22</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Takımlardan Biri 3 Farkla Kazanırmı</span> <span class="badge bg-f">tb31,tb32</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Tek/Çift</span> <span class="badge bg-f">b1,b2</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Toplam Gol Alt/Ust</span> <span class="badge bg-f">t01, t02, t11, t12, t21, t22, t31, t32, t41, t42, t51, t52</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Toplam Gol Aralığı (0-4)</span> <span class="badge bg-f">tga40,tga41,tga42</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Toplam Gol Aralığı (0-5)</span> <span class="badge bg-f">tga50,tga51,tga52</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Toplam Gol Aralığı (0-6)</span> <span class="badge bg-f">tga60,tga61,tga62</span>
          </li>
          <li class="code-list-item">
            <span><span class="badge bg-f mr10">T</span>Toplam Gol Sayısı 5+</span> <span class="badge bg-f">tg0,tg1,tg2,tg3,tg4,tg5</span>
          </li>
        </section>
      </div>
    </ul>
  </div>
</template>
<script>
export default {
  name:'Codelist',
  mounted () {
    
  },
  methods:{
   
  }
}
</script>