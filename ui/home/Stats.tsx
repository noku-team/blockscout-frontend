import { Grid } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';

import StatsItem from './StatsItem';

const hasGasTracker = config.features.gasTracker.isEnabled;
const hasAvgBlockTime = config.UI.homepage.showAvgBlockTime;
const rollupFeature = config.features.rollup;

const Stats = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const zkEvmLatestBatchQuery = useApiQuery('homepage_zkevm_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkEvm',
    },
  });

  const zkSyncLatestBatchQuery = useApiQuery('homepage_zksync_latest_batch', {
    queryOptions: {
      placeholderData: 12345,
      enabled: rollupFeature.isEnabled && rollupFeature.type === 'zkSync',
    },
  });

  if (isError || zkEvmLatestBatchQuery.isError || zkSyncLatestBatchQuery.isError) {
    return null;
  }

  const isLoading = isPlaceholderData ||
    (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && zkEvmLatestBatchQuery.isPlaceholderData) ||
    (rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && zkSyncLatestBatchQuery.isPlaceholderData);

  let content;

  const lastItemTouchStyle = { gridColumn: { base: 'span 2', lg: 'unset' } };

  let itemsCount = 5;
  !hasGasTracker && itemsCount--;
  !hasAvgBlockTime && itemsCount--;

  if (data) {
    !data.gas_prices && itemsCount--;
    data.rootstock_locked_btc && itemsCount++;
    const isOdd = Boolean(itemsCount % 2);

    content = (
      <>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && (
          <StatsItem
            icon="txn_batches"
            title="Latest batch"
            value={ (zkEvmLatestBatchQuery.data || 0).toLocaleString() }
            url={ route({ pathname: '/batches' }) }
            isLoading={ isLoading }
          />
        ) }
        { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && (
          <StatsItem
            icon="txn_batches"
            title="Latest batch"
            value={ (zkSyncLatestBatchQuery.data || 0).toLocaleString() }
            url={ route({ pathname: '/batches' }) }
            isLoading={ isLoading }
          />
        ) }
        { !(rollupFeature.isEnabled && (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync')) && (
          <StatsItem
            icon="block"
            title="Total blocks"
            value={ Number(data.total_blocks).toLocaleString() }
            url={ route({ pathname: '/blocks' }) }
            isLoading={ isLoading }
          />
        ) }
        { hasAvgBlockTime && (
          <StatsItem
            icon="clock-light"
            title="Average block time"
            value={ `${ (data.average_block_time / 1000).toFixed(1) }s` }
            isLoading={ isLoading }
          />
        ) }
        <StatsItem
          icon="transactions"
          title="Total transactions"
          value={ Number(data.total_transactions).toLocaleString() }
          url={ route({ pathname: '/txs' }) }
          isLoading={ isLoading }
        />
        <StatsItem
          icon="wallet"
          title="Wallet addresses"
          value={ Number(data.total_addresses).toLocaleString() }
          _last={ isOdd ? lastItemTouchStyle : undefined }
          isLoading={ isLoading }
        />
      </>
    );
  }

  return (
    <Grid
      gridTemplateColumns={{ lg: `repeat(${ itemsCount }, 1fr)`, base: '1fr 1fr' }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { content }
    </Grid>

  );
};

export default Stats;
