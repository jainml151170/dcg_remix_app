import {
    Page,
    Button,
    LegacyCard,
    DataTable,
    Pagination

} from "@shopify/polaris";
import React from "react";
import {useNavigate} from 'react-router-dom';

export default function Giveaway(){
    const rows = [
        ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
        ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
        [
          'Navy Merino Wool Blazer with khaki chinos and yellow belt',
          '$445.00',
          124518,
          32,
          '$14,240.00',
        ],
      ];
      const navigate = useNavigate();
    return (
        <Page
            title="List of Giveaways"
            primaryAction={
                <Button
                variant="primary"
                // url = "/app/addgiveaway"
                onClick = {() => navigate('/app/addgiveaway')}
                >
                    Add Giveaway
                </Button>
            }
        >
            <LegacyCard>
                <DataTable
                columnContentTypes={[
                    'text',
                    'numeric',
                    'numeric',
                    'numeric',
                    'numeric',
                ]}
                headings={[
                    'Product',
                    'Price',
                    'SKU Number',
                    'Net quantity',
                    'Net sales',
                ]}
                rows={rows}
                totals={['', '', '', 255, '$155,830.00']}
                pagination={{
                    label : 'Showing 10 pages',
                    hasPrevious : true,
                    onPrevious : () => {},
                    hasNext : true,
                    onNext : () => {}
                }}
                />
                {/* <Pagination
                    label={`Showing ${page} pages`}
                    hasPrevious={page > 1}
                    onPrevious={() => handlePageChange(page - 1)}
                    hasNext={page < totalPages}
                    onNext={() => handlePageChange(page + 1)}
                /> */}
            </LegacyCard>
        </Page>
    );
}