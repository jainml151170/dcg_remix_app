import React, { useState, useCallback } from "react";
import { json } from "@remix-run/node";
import {
    useSubmit
  } from "@remix-run/react";
import {
    Page,
    Layout,
    LegacyCard,
    TextField,
    DropZone,
    LegacyStack,
    Thumbnail,
    Text,
    FormLayout,
    PageActions,
    Button
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
  
    return null;
  };
  
export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const { shop } = session;
    const data = {
        ...Object.fromEntries(await request.formData()),
        shop,
    };
    console.log('shop 1 : ',shop)
    console.log('data 1 : ',data)
    const Giveaways =
    params.id === "new"
      ? await db.new_Giveaways.create({ data })
      : await db.new_Giveaways.update({ where: { id: Number(params.id) }, data });

    console.log('Giveaways : ', Giveaways)
    return null;
}
// export async function action({ request, params }) {

//     const { session } = await authenticate.admin(request);
    
//     const { shop } = session;
//     console.log('shop : ',shop)
//     /** @type {any} */
//     const data = {
//         ...Object.fromEntries(await request.formData()),
//         shop,
//     };
//     console.log('data 2 : ', data)

//     const Giveaways =
//     params.id === "new"
//       ? await db.Giveaways.create({ data })
//       : await db.Giveaways.update({ where: { id: Number(params.id) }, data });

//     console.log('Giveaways : ', Giveaways)
//     return null;
// }

export default function AddGiveaway() {

    const [isdisabled, setDisabled] = useState(true);
    const [appName, setAppName] = useState('');
    const [shortName, setShortName] = useState('');
    const [desktopImage, setDesktopImage] = useState<File>();
    const [mobileImage, setMobileImage] = useState<File>();
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('00:00');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('23:59');

    //handle start
    const handleChangeAppName = useCallback((value) => {
        setDisabled(false); 
        setAppName(value);
    }, []);

    const handleChangeAppShortName = useCallback((value) => {
        setDisabled(false);
        setShortName(value);
    }, []);

    const handleStartDate = useCallback((value) => {
        setDisabled(false);
        setStartDate(value)
    }, []);

    const handleEndDate = useCallback((value) => {
        setDisabled(false);
        setEndDate(value)
    }, []);

    const handleStartTime = useCallback((value) => {
        setDisabled(false);
        setStartTime(value)
    }, []);

    const handleEndTime = useCallback((value) => {
        setDisabled(false);
        setEndTime(value)
    }, []);

    const handleDropDesktopImage = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
        setDesktopImage(acceptedFiles[0]),
        [],
      );
    
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const desktopFileUpload = !desktopImage && <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />;
    const desktpUploadedFile = desktopImage && (
    <LegacyStack>
        <Thumbnail
        size="small"
        alt={desktopImage.name}
        source={
            validImageTypes.includes(desktopImage.type)
            ? window.URL.createObjectURL(desktopImage)
            : desktopImage
        }
        />
        <div>
        {desktopImage.name}{' '}
        <Text variant="bodySm" as="p">
            {desktopImage.size} bytes
        </Text>
        </div>
    </LegacyStack>
    ); 

    const handleDropMobileImage = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
        setMobileImage(acceptedFiles[0]),
        [],
    );
    const mobileFileUpload = !mobileImage && <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />;
    const mobileUploadedFile = mobileImage && (
    <LegacyStack>
        <Thumbnail
        size="small"
        alt={mobileImage.name}
        source={
            validImageTypes.includes(mobileImage.type)
            ? window.URL.createObjectURL(mobileImage)
            : mobileImage
        }
        />
        <div>
        {mobileImage.name}{' '}
        <Text variant="bodySm" as="p">
            {mobileImage.size} bytes
        </Text>
        </div>
    </LegacyStack>
    ); 

    const submit = useSubmit();
    const handleSubmit = async () => {
        const formDataSet = {
            name:appName,
            short_name:shortName,
            start_date:startDate,
            end_date:endDate,
            start_time:startTime,
            end_time:endTime,


        }
        console.log('formDataSet :', formDataSet)
        submit({formDataSet}, { method: "post" });
    }
    return (
        <Page
            backAction={{ content: 'Products', url: '#' }}
            title="Add Giveaway"
            subtitle="Create New Giveaway"
            primaryAction={<Button variant="primary" disabled = {isdisabled} onClick = {()=>handleSubmit()} >Save</Button>}
        >
            <Layout>
                <Layout.Section>
                    <LegacyCard title="Name Information" sectioned>
                        <TextField
                            label="Name"
                            value={appName}
                            onChange={handleChangeAppName}
                            autoComplete="on"
                            helpText={
                                <span>
                                    The long name will only be seen by the Shopify Admin
                                </span>
                            }
                        />
                        <TextField
                            label="Short name"
                            value={shortName}
                            onChange={handleChangeAppShortName}
                            autoComplete="on"
                            type="number"
                            helpText={
                                <span>
                                    Short name is visible to the customers and its usually a numeric indicator for those who enter multiple times.
                                </span>
                            }
                        />
                    </LegacyCard>
                    <LegacyCard title="Media" sectioned>
                        <DropZone label="Desktop Image" allowMultiple={false} onDrop={handleDropDesktopImage}>
                        {desktpUploadedFile}
                        {desktopFileUpload}
                        </DropZone>

                        <DropZone label="Mobi01le Image" allowMultiple={false} onDrop={handleDropMobileImage}>
                        {mobileUploadedFile}
                        {mobileFileUpload}
                        </DropZone>
                        
                    </LegacyCard>
                    <LegacyCard title="Date Information" sectioned>
                        <FormLayout.Group>
                            <TextField
                                label="Start Date"
                                value={startDate}
                                onChange={handleStartDate}
                                autoComplete="date"
                                type="date"
                                helpText={
                                    <span>
                                        Date when the competition will start
                                    </span>
                                }
                            />
                            <TextField
                                label="Start Time"
                                value={startTime}
                                onChange={handleStartTime}
                                autoComplete="time"
                                type="time"
                                helpText={
                                    <span>
                                        Time when the competition will start
                                    </span>
                                }
                            />
                        </FormLayout.Group>
                        <FormLayout.Group>
                            <TextField
                                label="End Date"
                                value={endDate}
                                onChange={handleEndDate}
                                autoComplete="date"
                                type="date"
                                helpText={
                                    <span>
                                        Date when the competition will end
                                    </span>
                                }
                            />
                            <TextField
                                label="End Time"
                                value={endTime}
                                onChange={handleEndTime}
                                autoComplete="time"
                                type="time"
                                helpText={
                                    <span>
                                        Time when the competition will end
                                    </span>
                                }
                            />
                        </FormLayout.Group>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                </Layout.Section>
            </Layout>
            
            <PageActions
            primaryAction={<Button variant="primary" disabled = {isdisabled} onClick = {()=>handleSubmit()} >Save</Button>}
            />
        </Page>
    );
}