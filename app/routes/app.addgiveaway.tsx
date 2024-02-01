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
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);
  
    return null;
  };
  
export const action = async ({ request, params }: ActionFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const { shop } = session;
    const data : any = {
      shop,
        ...Object.fromEntries(await request.formData()),        
    };
    const Giveaways =
    params.id === "new"
      ? await db.giveaways.create({ data })
      : await db.giveaways.update({ where: { id: Number(params.id) }, data });

  
    return null;
}

export default function AddGiveaway() {

    const [isdisabled, setDisabled] = useState(true);
    const [appName, setAppName] = useState('');
    const [shortName, setShortName] = useState('');

    //handle start
    const handleChangeAppName = useCallback((value : any) => {
        setDisabled(false); 
        setAppName(value);
    }, []);

    const handleChangeAppShortName = useCallback((value : any) => {
        setDisabled(false);
        setShortName(value);
    }, []);

    const submit = useSubmit();
    const handleSubmit = async () => {
        const formDataSet = {
            name:appName,
            short_name:shortName,
          }
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
