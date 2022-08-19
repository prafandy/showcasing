<template>
  <div>
    <documentation
      v-for="(item, index) in items"
      :key="`item-0-${index}`"
      :title="item.title"
      :descriptions="item.descriptions || []"
      :items="item.items || []" />
  </div>
</template>

<script>
import Documentation from '@/components-vue/Documentation';

import { getItems } from '@/datas/documentation.js';

export default {
  name: 'Index',
  components: { documentation: Documentation },
  data: () => {
    return {
      items: [],
    };
  },
  async created () {
    this.items = getItems();
  },
  computed: {
    
  },
  methods: {
    
  },
}
</script>
