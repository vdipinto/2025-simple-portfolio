'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Image from '@tiptap/extension-image'
import clsx from 'clsx'
import { forwardRef, useImperativeHandle } from 'react'

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null

  const buttonBase =
    'px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 transition'

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={clsx(buttonBase, editor.isActive('bold') && 'bg-black text-white')}
      >
        Bold
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={clsx(buttonBase, editor.isActive('italic') && 'bg-black text-white')}
      >
        Italic
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={clsx(buttonBase, editor.isActive('strike') && 'bg-black text-white')}
      >
        Strike
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={clsx(
          buttonBase,
          editor.isActive('heading', { level: 2 }) && 'bg-black text-white'
        )}
      >
        H2
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(buttonBase, editor.isActive('bulletList') && 'bg-black text-white')}
      >
        Bullet
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(buttonBase, editor.isActive('orderedList') && 'bg-black text-white')}
      >
        Ordered
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={clsx(buttonBase, editor.isActive('codeBlock') && 'bg-black text-white')}
      >
        Code Block
      </button>
      <button 
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().undo().run()} className={buttonBase}>
        Undo
      </button>
      <button 
        type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().redo().run()} className={buttonBase}>
        Redo
      </button>
      <button
      type="button" // ✅ Prevents form submission
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={clsx(buttonBase, editor.isActive('blockquote') && 'bg-black text-white')}
      >
        Quote
      </button>
      <button
        type="button" // ✅ Prevents form submission
        onClick={() => {
          const url = window.prompt('Enter image URL')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        className={buttonBase}
      >
        Image
      </button>
    </div>
  )
}

// Extensions
const extensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Color.configure({ types: ['textStyle'] }),
  TextStyle,
  ListItem,
  Image,
]

// TiptapEditor with ref to expose getContent()
export const TiptapEditor = forwardRef(function TiptapEditor(
  { content }: { content?: any },
  ref: React.Ref<{ getContent: () => any }>
) {
  const editor = useEditor({
    content,
    extensions,
    immediatelyRender: false,
  })

  useImperativeHandle(ref, () => ({
    getContent: () => editor?.getJSON(),
  }))

  if (!editor) return null

  return (
    <div className="tiptap prose prose-sm sm:prose lg:prose-lg max-w-none">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
})
