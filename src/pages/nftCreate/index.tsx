import { PictureOutlined } from '@ant-design/icons'
import { Button, Input, Upload } from 'antd'
import Back from 'components/Back'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const { TextArea } = Input
export default function NFTCreate() {
  const { t } = useTranslation()
  const [activeItemOfCount, setActiveItemOfCount] = useState(0)
  const [activeItemOfCustomize, setActiveItemOfCustomize] = useState(0)
  const [previewVisible, setPrebiewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPrebiewVisible(true)
    setPreviewImage(file.url || file.preview)
  }

  return (
    <div className="px-4 max-w-6xl mx-auto">
      <div className="mt-8 flex flex-row justify-between">
        <Back />
        <div
          className="ml-4 flex-1 rounded-2xl flex flex-col items-center"
          style={{ backgroundColor: '#FFFBEC' }}
        >
        <span className="mt-8 font-bold text-2xl mb-4 text-light-black">
          {t("create_koge_nft")}
        </span>
          <span className="text-base mb-10 text-dark-gray">
            {t("nft_description")}
        </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col mt-10">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t("select_create_count")}
          </span>
          <div className="flex flex-row">
            <div
              className={`cursor-pointer h-10 text-sm text-center w-full mr-4 border leading-10 rounded  ${activeItemOfCount === 0 ? 'border-yellow' : 'border-gray'}`}
              onClick={() => setActiveItemOfCount(0)}
            >
              {t("create_single_nft")}
            </div>
            <div
              className={`cursor-pointer h-10 text-sm text-center w-full border leading-10 rounded ${activeItemOfCount === 1 ? 'border-yellow' : 'border-gray'}`}
              onClick={() => setActiveItemOfCount(1)}
            >
              {t("create_multiple_nfts")}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t("create_nft_type")}
          </span>
          <div className="flex flex-row">
            <div
              className={`cursor-pointer h-10 text-sm text-center w-full mr-4 border leading-10 rounded ${activeItemOfCustomize === 0 ? 'border-yellow' : 'border-gray'}`}
              onClick={() => setActiveItemOfCustomize(0)}
            >
              {t("customize")}
            </div>
            <div
              className={`cursor-pointer h-10 text-sm text-center w-full border text-yellow leading-10 rounded ${activeItemOfCustomize === 1 ? 'border-yellow' : 'border-gray'}`}
              onClick={() => setActiveItemOfCustomize(1)}
            >
              {t("system_customize")}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-12">
        <span className="text-sm font-medium mb-2 text-light-black">
          {t("upload_nft_file")}
        </span>
          <div className="flex flex-col bg-light-white w-full items-center px-12 justify-center py-24">
            {
              previewVisible
                ? <img alt="example" style={{ width: '100%' }} src={previewImage} />
                : <>
                  <PictureOutlined className="text-3xl" />
                  <div className="max-w-xs text-light-black text-xs font-medium mt-3 text-center">
                    {t("upload_nft_file_requirement")}
                  </div>
                  <Upload
                    action=""
                    accept="image/*"
                    onPreview={handlePreview}
                  >
                    <Button className="h-10 mt-4 w-38 text-sm text-light-black bg-yellow">
                      {t("upload_image")}
                    </Button>
                  </Upload></>
            }

          </div>
        </div>
        <div className="flex flex-col mt-12">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t("nft_name")}
          </span>
          <Input
            placeholder={t("please_input")}
            className="h-12 rounded font-medium text-sm text-light-black"
          />
        </div>
        <div className="flex flex-col mt-12">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t("nft_brief_description")}
          </span>
          <TextArea
            rows={4}
            placeholder={t("please_input")}
            className="rounded font-medium text-sm text-light-black"
          />
        </div>
        {activeItemOfCount === 1 && <div className="flex flex-col mt-12">
          <span className="text-sm font-medium mb-2 text-light-black">
            {t("amount")}
          </span>
          <Input type={'number'} />
        </div>}
        <div className="flex flex-row justify-between text-sm mt-12">
          <span className="text-dark-gray ">{t("payment_hint")}</span>
          <span className="text-light-black font-medium">
            {t("payment_value", {val: 101})}
        </span>
        </div>
        <div className="flex flex-row justify-between text-sm mt-4">
          <span className="text-dark-gray ">{t("nft_id_hint")}</span>
          <span className="text-light-black font-medium">{t("nft_id_value", {val: 1234})}</span>
        </div>
        <Button className="h-12 text-sm text-light-black bg-yellow rounded font-medium mt-6 mb-20 w-full">
          {t("submit_nft")}
        </Button>
      </div>
    </div>
  )
}
