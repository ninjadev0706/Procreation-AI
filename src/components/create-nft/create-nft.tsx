import { useEffect, useState } from 'react';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Slider from '@material-ui/core/Slider';

import { useWallet } from '@solana/wallet-adapter-react';

import { toast } from 'react-toastify';
import { Transition } from '@/components/ui/transition';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Uploader from '@/components/ui/forms/uploader';
import InputLabel from '@/components/ui/input-label';
import ToggleBar from '@/components/ui/toggle-bar';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Ethereum } from '@/components/icons/ethereum';
import { Flow } from '@/components/icons/flow';
import { Warning } from '@/components/icons/warning';
import { Unlocked } from '@/components/icons/unlocked';
import Avatar from '@/components/ui/avatar';
//images
import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';
import PriceType from '@/components/create-nft/price-types-props';

const BlockchainOptions = [
  {
    id: 1,
    name: 'Ethereum',
    value: 'ethereum',
    icon: <Ethereum />,
  },
  {
    id: 2,
    name: 'Flow',
    value: 'flow',
    icon: <Flow />,
  },
];

const WidthOptions = [
  {
    id: 1,
    name: '512',
    value: '512',
  },
  {
    id: 2,
    name: '768',
    value: '768',
  },
  {
    id: 2,
    name: '1024',
    value: '1024',
  },
];

const HeightOptions = [
  {
    id: 1,
    name: '512',
    value: '512',
  },
  {
    id: 2,
    name: '768',
    value: '768',
  },
];

const SchedulerOptions = [
  {
    id: 1,
    name: 'DDIM',
    value: 'DDIM',
  },
  {
    id: 2,
    name: 'K_EULER',
    value: 'K_EULER',
  },
  {
    id: 3,
    name: 'DPMSolverMultistep',
    value: 'DPMSolverMultistep',
  },
  {
    id: 4,
    name: 'K_EULER_ANCESTRAL',
    value: 'K_EULER_ANCESTRAL',
  },
  {
    id: 5,
    name: 'PNDM',
    value: 'PNDM',
  },
  {
    id: 6,
    name: 'KLMS',
    value: 'KLMS',
  },
];

const widthmarks = [
  {
    value: 512,
    label: '512',
  },
  {
    value: 768,
    label: '768',
  },
  {
    value: 1024,
    label: '1024',
  },
];

const heightmarks = [
  {
    value: 512,
    label: '512',
  },
  {
    value: 768,
    label: '768',
  },
];

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

const initialValues = {
  prompt: '',
  negative_prompt: '',
  prompt_strength: 0.8,
  num_inference_steps: 50,
  guidance_scale: 7.5,
  seed: 1,
  num_outputs: 1,
  price: 0,
  name: '',
  symbol: '',
  external_link: 'https://procreation.ai',
  description: '',
  royalty_fee: 5,
};

export default function CreateNFT() {
  let [publish, setPublish] = useState(true);
  let [isAgree, setAgree] = useState(false);
  let [isUpload, setUpload] = useState(false);
  let [isNFT, setNFT] = useState('');
  let [isModal, setIsModal] = useState('stable');

  let [isSelect, setSelect] = useState(false);

  let [explicit, setExplicit] = useState(false);
  let [unlocked, setUnlocked] = useState(false);
  let [priceType, setPriceType] = useState('fixed');
  let [blockchain, setBlockChain] = useState(BlockchainOptions[0]);
  let [picWidth, setPicWidth] = useState(WidthOptions[0]);
  let [picHeight, setPicHeight] = useState(WidthOptions[0]);
  let [scheduler, setScheduler] = useState(SchedulerOptions[0]);
  const [values, setValues] = useState(initialValues);

  const [validations, setValidations] = useState({
    name: '',
    symbol: '',
    description: '',
  });

  const [walletAddr, setWalletAddr] = useState('');

  const [prediction, setPrediction] = useState(null as any);
  const [error, setError] = useState(null);

  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log('dsfasd => ', wallet.publicKey.toString());
      setWalletAddr(wallet.publicKey.toString());
    }
  }, [wallet]);

  const handleCreate = async (e: any) => {
    e.preventDefault();

    console.log("vaue => ", isModal)

    if (isModal === 'stable') {
      let response;
      try {
        response = await fetch('/api/predictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: values.prompt,
            negative_prompt: values.negative_prompt,
            width: picWidth.value,
            height: picHeight.value,
            prompt_strength: values.prompt_strength,
            num_inference_steps: values.num_inference_steps,
            guidance_scale: values.guidance_scale,
            scheduler: scheduler.name,
            seed: values.seed,
          }),
        });
      } catch (error) {
        console.log('err => ', error);
      }

      let prediction = await response?.json();

      if (response?.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);

      while (
        prediction.status !== 'succeeded' &&
        prediction.status !== 'failed'
      ) {
        await sleep(1000);
        const response = await fetch('/api/predictions/' + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        setPrediction(prediction);
      }
    }

    if (isModal === 'portrait') {
      let response;
      try {
        response = await fetch('/api/predictions/portrait', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: values.prompt,
            negative_prompt: values.negative_prompt,
            width: picWidth.value,
            height: picHeight.value,
            prompt_strength: values.prompt_strength,
            num_inference_steps: values.num_inference_steps,
            guidance_scale: values.guidance_scale,
            scheduler: scheduler.name,
            seed: values.seed,
          }),
        });
      } catch (error) {
        console.log('err => ', error);
      }

      let prediction = await response?.json();

      if (response?.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);

      while (
        prediction.status !== 'succeeded' &&
        prediction.status !== 'failed'
      ) {
        await sleep(1000);
        const response = await fetch('/api/predictions/' + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        setPrediction(prediction);
      }
    }

    toast.success('You generate Image', {
      position: 'top-right',
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const onMint = async () => {
    const isValid = validateAll();

    if (!isValid) {
      return false;
    }

    let response;
    try {
      response = await fetch('/api/predictions/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          symbol: values.symbol,
          imgUrl: prediction.output[0],
          description: values.description,
          external_link: values.external_link,
          fee: values.royalty_fee,
          walletAddr: walletAddr,
        }),
      });
    } catch (error) {
      console.log('err => ', error);
    }

    const data = await response?.json();
    setNFT(data.url);

    // let preview;

    // if (data.id) {
    //   try {
    //     preview = await fetch('/api/predictions/status', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         nftId: data.id,
    //       }),
    //     });
    //   } catch (error) {
    //     console.log('err => ', error);
    //   }

    //   const txHash = await preview?.json();
    //   if (txHash?.onChain?.mintHash) {
    //     setNFT(txHash?.onChain?.mintHash);
    //   }

    //   toast.success('You minted NFT', {
    //     position: 'top-right',
    //     autoClose: 1000,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    // }
  };

  const OnConfirm = () => {
    setSelect(true);
  };

  const handReCreate = () => {
    setSelect(false);
  };

  const handleUpload = (value: any) => {
    if (value === 'auction') {
      setUpload(true);
    } else {
      setUpload(false);
    }

    setIsModal(value);
  };

  const handleChange = (e: any) => {
    setValues((values) => {
      return { ...values, [e.target.name]: e.target.value };
    });
  };

  const validateOne = (e: any) => {
    const { name } = e.target;
    const value = e.target.value;
    let message = '';

    if (!value) {
      message = `${name} is required`;
    }

    if (value && (value.length < 3 || value.length > 50)) {
      message = `${name} must contain between 3 and 50 characters`;
    }

    setValidations({ ...validations, [name]: message });
  };

  const validateAll = () => {
    const { name, symbol, description } = values;
    const validations = { name: '', symbol: '', description: '' };
    let isValid = true;

    if (!name) {
      validations.name = 'Name is required';
      isValid = false;
    }

    if ((name && name.length < 3) || name.length > 10) {
      validations.name = 'Name must contain between 3 and 10 characters';
      isValid = false;
    }

    if (!symbol) {
      validations.symbol = 'Symbol is required';
      isValid = false;
    }

    if ((symbol && symbol.length < 3) || symbol.length > 20) {
      validations.symbol = 'Symbol must contain between 3 and 20 characters';
      isValid = false;
    }

    if (!description) {
      validations.description = 'Description is required';
      isValid = false;
    }

    if ((description && description.length < 3) || description.length > 100) {
      validations.description =
        'Description must contain between 3 and 100 characters';
      isValid = false;
    }

    if (!isValid) {
      setValidations(validations);
    }

    return isValid;
  };

  const {
    name: nameVal,
    symbol: symbolVal,
    description: descriptionVal,
  } = validations;

  return (
    <>
      <NextSeo
        title="Create NFT"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-full sm:pt-0 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Create New Item
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="max-h-[300px] lg:col-span-2">
            {/* File uploader */}
            {isUpload && (
              <div className="mb-8">
                <InputLabel title="Upload file" important />
                <Uploader />
              </div>
            )}

            {/* NFT price type */}
            <div className="flex items-center justify-between gap-4">
              <InputLabel
                title="Put on marketplace"
                subTitle="Enter price to allow users instantly purchase your NFT"
              />
              <div className="shrink-0">
                <Switch checked={publish} onChange={() => setPublish(!publish)}>
                  <div
                    className={cn(
                      publish ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-700',
                      'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
                    )}
                  >
                    <span
                      className={cn(
                        publish
                          ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark'
                          : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark',
                        'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
                      )}
                    />
                  </div>
                </Switch>
              </div>
            </div>
            {publish && (
              <PriceType
                value={priceType}
                onChange={setPriceType}
                handleUpload={handleUpload}
              />
            )}
            {isSelect && (
              <>
                <br />

                <div className="mb-8">
                  <InputLabel title="Name" important />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    onChange={handleChange}
                    value={values.name}
                    onBlur={validateOne}
                  />
                  <div className="text-red-500">{nameVal}</div>
                </div>

                <div className="mb-8">
                  <InputLabel title="Symbol" important />
                  <Input
                    type="text"
                    name="symbol"
                    placeholder="Item symbol"
                    onChange={handleChange}
                    value={values.symbol}
                    onBlur={validateOne}
                  />
                  <div className="text-red-500">{symbolVal}</div>
                </div>

                <div className="mb-8">
                  <InputLabel
                    title="External link"
                    subTitle="We will include a link to this URL on this item's detail page, so that users can click to learn more about it."
                  />
                  <Input
                    name="external_link"
                    type="text"
                    placeholder="https://procreation.ai"
                    // onChange={handleChange}
                    defaultValue={values.external_link}
                  />
                </div>

                <div className="mb-8">
                  <InputLabel
                    title="Description"
                    subTitle="The description will be included on the item's detail page underneath its image."
                  />
                  <Textarea
                    name="description"
                    placeholder="Provide a detailed description of your item"
                    onChange={handleChange}
                    value={values.description}
                    onBlur={validateOne}
                  />
                  <div className="text-red-500">{descriptionVal}</div>
                </div>

                <div className="mb-8">
                  <InputLabel title="Royalty Fees" />
                  <div className="flex">
                    <Input
                      name="royalty_fee"
                      type="number"
                      placeholder="1"
                      value={values.royalty_fee}
                      onChange={handleChange}
                      className="royalty_fee"
                      min={1}
                      max={100}
                    />
                    <Slider
                      aria-labelledby="discrete-slider-always"
                      name="royalty_fee"
                      value={values.royalty_fee}
                      onChange={(e, value: any) => {
                        setValues({ ...values, royalty_fee: value });
                      }}
                      min={1}
                      max={100}
                    />
                  </div>
                </div>
              </>
            )}

            {!isSelect && (
              <>
                <br />
                {/* Prompt */}
                <div className="mb-8">
                  <InputLabel title="Prompt" important />
                  <Input
                    type="text"
                    placeholder="Enter a prompt to display an image"
                    name="prompt"
                    value={values.prompt}
                    onChange={handleChange}
                  />
                </div>

                {/* Negative Prompt */}
                <div className="mb-8">
                  <InputLabel title="Negative Prompt" important />
                  <Input
                    type="text"
                    placeholder="Enter a negative prompt to display an image"
                    name="negative_prompt"
                    value={values.negative_prompt}
                    onChange={handleChange}
                  />
                </div>

                {/* Width */}
                <div className="mb-8">
                  <InputLabel title="Width" />
                  <div className="relative">
                    <Listbox value={picWidth} onChange={setPicWidth}>
                      <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                        <div className="flex items-center">{picWidth.name}</div>
                        <ChevronDown />
                      </Listbox.Button>
                      <Transition
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                          {WidthOptions.map((option) => (
                            <Listbox.Option key={option.id} value={option}>
                              {({ selected }) => (
                                <div
                                  className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100  ${selected
                                    ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                                    }`}
                                >
                                  {option.name}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                  </div>
                </div>

                {/* Height */}
                <div className="mb-8">
                  <InputLabel title="Height" />
                  <div className="relative">
                    <Listbox value={picHeight} onChange={setPicHeight}>
                      <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                        <div className="flex items-center">
                          {picHeight.name}
                        </div>
                        <ChevronDown />
                      </Listbox.Button>
                      <Transition
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                          {HeightOptions.map((option) => (
                            <Listbox.Option key={option.id} value={option}>
                              {({ selected }) => (
                                <div
                                  className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100  ${selected
                                    ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                                    }`}
                                >
                                  {option.name}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                  </div>
                </div>

                <div className="mb-8">
                  <InputLabel title="Prompt_Strength" />
                  <Input
                    name="prompt_strength"
                    type="number"
                    placeholder="1"
                    value={values.prompt_strength}
                    step={0.1}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-8">
                  <InputLabel title="Num_Outputs" />
                  <div className="flex">
                    <Input
                      name="num_outputs"
                      type="number"
                      placeholder="1"
                      value={values.num_outputs}
                      onChange={handleChange}
                      className="num_outputs"
                      min={1}
                      max={4}
                    />
                    <Slider
                      aria-labelledby="discrete-slider-always"
                      name="num_outputs"
                      value={values.num_outputs}
                      onChange={(e, value: any) => {
                        setValues({ ...values, num_outputs: value });
                      }}
                      min={1}
                      max={4}
                    />
                  </div>
                  <InputLabel
                    title=""
                    subTitle="Number of images to output. (minimum: 1; maximum: 4)"
                  />
                </div>

                <div className="mb-8">
                  <InputLabel title="Num_Inference_Steps" />
                  <div className="flex">
                    <Input
                      name="num_inference_steps"
                      type="number"
                      placeholder="1"
                      value={values.num_inference_steps}
                      onChange={handleChange}
                      className="num_outputs"
                      min={1}
                      max={500}
                    />
                    <Slider
                      aria-labelledby="discrete-slider-always"
                      name="num_inference_steps"
                      value={values.num_inference_steps}
                      onChange={(e, value: any) => {
                        setValues({ ...values, num_inference_steps: value });
                      }}
                      min={1}
                      max={500}
                    />
                  </div>
                  <InputLabel
                    title=""
                    subTitle="Number of images to output. (minimum: 1; maximum: 4)"
                  />
                </div>

                <div className="mb-8">
                  <InputLabel title="Guidance_scale" />
                  <div className="flex">
                    <Input
                      name="guidance_scale"
                      type="number"
                      placeholder="1"
                      value={values.guidance_scale}
                      onChange={handleChange}
                      className="num_outputs"
                      min={1}
                      max={20}
                      step={0.01}
                    />
                    <Slider
                      aria-labelledby="discrete-slider-always"
                      name="guidance_scale"
                      value={values.guidance_scale}
                      onChange={(e, value: any) => {
                        setValues({ ...values, guidance_scale: value });
                      }}
                      min={1}
                      max={20}
                      step={0.01}
                    />
                  </div>
                  <InputLabel
                    title=""
                    subTitle="Number of images to output. (minimum: 1; maximum: 4)"
                  />
                </div>

                <div className="mb-8">
                  <InputLabel title="Scheduler" />
                  <div className="relative">
                    <Listbox value={scheduler} onChange={setScheduler}>
                      <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                        <div className="flex items-center">
                          {scheduler.name}
                        </div>
                        <ChevronDown />
                      </Listbox.Button>
                      <Transition
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                          {SchedulerOptions.map((option) => (
                            <Listbox.Option key={option.id} value={option}>
                              {({ selected }) => (
                                <div
                                  className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100  ${selected
                                    ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                                    }`}
                                >
                                  {option.name}
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                  </div>
                </div>

                <div className="mb-8">
                  <InputLabel title="Seed" />
                  <Input
                    name="seed"
                    type="number"
                    placeholder="1"
                    value={values.seed}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Unlockable content */}
            {/* <div className="mb-3">
          <ToggleBar
            title="Unlockable Content"
            subTitle="Include unlockable content that can only be revealed by the owner of the item."
            icon={<Unlocked />}
            checked={unlocked}
            onChange={() => setUnlocked(!unlocked)}
          >
            {unlocked && (
              <Textarea placeholder="Enter content (access key, code to redeem, link to a file, etc.)" />
            )}
          </ToggleBar>
        </div> */}

            {/* Explicit content */}
            {/* <div className="mb-8">
          <ToggleBar
            title="Explicit &amp; Sensitive Content"
            subTitle="Set this item as explicit and sensitive content"
            icon={<Warning />}
            checked={explicit}
            onChange={() => setExplicit(!explicit)}
          />
        </div> */}

            {/* Supply */}
            {/* <div className="mb-8">
          <InputLabel
            title="Supply"
            subTitle="The number of items that can be minted."
          />
          <Input type="number" placeholder="1" disabled />
        </div> */}

            {/* Blockchain */}
            {/* <div className="mb-8">
          <InputLabel title="Blockchain" />
          <div className="relative">
            <Listbox value={blockchain} onChange={setBlockChain}>
              <Listbox.Button className="text-case-inherit letter-space-inherit flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition-shadow duration-200 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600 sm:h-12 sm:px-5">
                <div className="flex items-center">
                  <span className="ltr:mr-2 rtl:ml-2">{blockchain.icon}</span>
                  {blockchain.name}
                </div>
                <ChevronDown />
              </Listbox.Button>
              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-large outline-none dark:border-gray-700 dark:bg-gray-800 xs:p-2">
                  {BlockchainOptions.map((option) => (
                    <Listbox.Option key={option.id} value={option}>
                      {({ selected }) => (
                        <div
                          className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition dark:text-gray-100  ${selected
                              ? 'bg-gray-200/70 font-medium dark:bg-gray-600/60'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700/70'
                            }`}
                        >
                          <span className="ltr:mr-2 rtl:ml-2">
                            {option.icon}
                          </span>
                          {option.name}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        </div> */}

            {isSelect ? (
              <Button shape="rounded" onClick={handReCreate}>
                RECREATE
              </Button>
            ) : (
              <Button shape="rounded" onClick={handleCreate}>
                CREATE
              </Button>
            )}
            {!isSelect ? (
              <Button shape="rounded" className="ml-2 mb-6" onClick={OnConfirm}>
                CONFIRM
              </Button>
            ) : (
              <Button shape="rounded" className="ml-2 mb-6" onClick={onMint}>
                MINT NFT
              </Button>
            )}
          </div>

          <div className="hidden flex-col lg:flex">
            {/* NFT preview */}
            <InputLabel title="Preview" />
            <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
              <div className="flex items-center p-4 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400">
                <Avatar
                  size="sm"
                  image={AuthorImage}
                  alt="Cameronwilliamson"
                  className="border-white bg-gray-300 ltr:mr-3 rtl:ml-3 dark:bg-gray-400"
                />
                @Cameronwilliamson
              </div>
              <div className="relative block w-full pb-full">
                {prediction && (
                  <>
                    {prediction.output ? (
                      <Image
                        src={prediction.output[prediction.output.length - 1]}
                        layout="fill"
                        objectFit="cover"
                        alt="Pulses of Imagination #214"
                      />
                    ) : (
                      <p>&nbsp; status: {prediction.status} ... </p>
                    )}
                  </>
                )}
              </div>
              <div className="p-5">
                <div className="text-sm font-medium text-black dark:text-white">
                  Pulses Of Imagination #214
                </div>
                <div className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  0.40 ETH
                </div>
                {isNFT !== '' && isSelect && (
                  <div>
                    <a href={`${isNFT}`} target="_blank" rel="noreferrer">
                      <div className="mt-4 w-fit rounded-lg bg-emerald-400 p-2 text-lg font-medium text-gray-900 dark:text-white">
                        View NFT
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
