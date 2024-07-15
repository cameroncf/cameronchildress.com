---
title: Recent Posts
outline: false
excludeFromRss: true
---

<script setup>
import { data as posts } from '../../.vitepress/data/posts.data'
</script>


# Recent Posts


<ul>
  <li v-for="post of posts">
    {{ post.date.string }} - <a :href="post.url">{{ post.title }}</a>
  </li>
</ul>

