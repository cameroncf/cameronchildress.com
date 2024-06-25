---
title: The Blog
outline: false
---

<script setup>
import { data as posts } from '../../.vitepress/data/posts.data'
</script>


<h1>All Blog Posts</h1>


<ul>
  <li v-for="post of posts">
    {{ post.date.string }} - <a :href="post.url">{{ post.title }}</a>
  </li>
</ul>

