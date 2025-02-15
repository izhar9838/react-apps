import React, { Component } from 'react';
function Card({username, obj}){
    return (
        <figure classNameNameName="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800 mb-4">
  <img classNameNameName="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" width="384" height="512"/>
  <div classNameNameName="pt-6 md:p-8 text-center md:text-left space-y-4">
    <blockquote>
      <p classNameNameName="text-lg font-medium">
        “Tailwind CSS is the only framework that I've seen scale
        on large teams. It’s easy to customize, adapts to any design,
        and the build size is tiny.”
      </p>
    </blockquote>
    <figcaption classNameNameName="font-medium">
      <div classNameNameName="text-sky-500 dark:text-sky-400">
        {username}
      </div>
      <div classNameNameName="text-slate-700 dark:text-slate-500">
        {obj.desg}
      </div>
    </figcaption>
  </div>
</figure>
    )
}
export default Card;