import {h} from 'dom-chef'
import _ from 'lodash'
import select from 'select-dom'
import { observe } from 'selector-observer'
import {
  icons,
  safeElementReady,
  api,
  fetchHtml,
  constants,
  forms
} from '../utils'

export const addMarkdownPreview = () => {
  observe(".facebox-content.project-modal", {
    add(el) {
      addPreview(el)
      // el.addEventListener('DOMAttrModified', addPreview(el))
    },
  })
}

export const addPreview = async el => {
  const textArea = select('textarea', el)
  if (textArea.id !== 'card_note_text') {
    return
  }
  const content = textArea.value
  const currentForm = select('.form-group', el)
  const html = await fetchHtml(constants.URL_TOKEN)
  const authenticityToken = select('form > input[name="authenticity_token"]', html).value
  const elementPreviewToken = select('.js-suggester-container', html);
  const previewToken = elementPreviewToken.attributes.getNamedItem('data-preview-authenticity-token').value
  const elementUploadToken = select('.write-content.js-write-bucket.js-uploadable-container', html)
  const uploadToken = elementUploadToken.attributes.getNamedItem('data-upload-policy-authenticity-token').value

  currentForm.after(forms.previewForm(authenticityToken, previewToken, uploadToken))
  currentForm.remove()
  select('textarea', el).value = content
}
