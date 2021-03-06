<?php

if ( ! defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * Manage CC cron tasks
 *
 * @package CarbonCopy
 * @subpackage cc
 * @author porquero
 */
class cron extends MX_Controller {

    /**
     * Translation of interval for Mysql query
     *
     * @var array
     */
    private $_interval = array(
        'daily' => 'DAY',
        'weekly' => 'WEEK'
    );

    /**
     * Generates a send email notification to CC users.
     */
    public function run($key = NULL)
    {
        if (is_null($key) || (string) $key !== (string) _CRON_KEY) {
            echo 'Not allowed!';
            exit;
        }

        $this->load->module('file/read');

        $config = $this->read->json_content("_accounts/cc/config.json");

        // Run daily.
        if ($config['notification'] === 'daily') {
            $this->_email_notifications($this->_interval[$config['notification']]);
            echo 'Sent daily notifications!';
        }
        // Run weekly.
        elseif ($config['notification_day'] === strtolower(date('l'))) {
            $this->_email_notifications($this->_interval[$config['notification']]);
            echo 'Sent weekly notifications!';
        }
        else {
            echo 'Nothing sent...';
        }
    }

    /**
     * Run notification script using intervals.
     * 
     * @param string $interval DAY|WEEK
     */
    private function _email_notifications($interval)
    {
        $this->load->model('m_cron');
        $this->load->model('m_user');
        $this->load->library('email');
        $this->load->module('file/misc');

        $participants = Modules::run('account/participant/list_for_resume');
        $emails = $this->m_user->emails();

        foreach ($participants as $participant) {
            // Active users only.
            if ( ! $participant->active !== FALSE) {
                continue;
            }

            $resume = array_unique($this->m_cron->get_activity($participant->info['id'], $interval, 'to') + $this->_actions_participating($participant, $interval));
            $user_activity = array_unique($this->m_cron->get_activity($participant->info['id'], $interval));

            // Don't send if no any activity.
            if (count($resume) === 0 && count($user_activity) === 0) {
                continue;
            }

            $data = array(
                'resume' => $resume,
                'user_activity' => $user_activity,
            );

            $message = $this->load->view('email_notification.phtml', $data, true);
            // Test only!
//            echo $message;

            $this->email->set_mailtype('html');
            $this->email->from('noreply@carboncopycc.com', 'CarbonCopy');
            $this->email->to($emails[$participant->info['id']]);
            // Test only!
//            $this->email->to('criffoh@gmail.com, criffoh@yahoo.es');

            $this->email->subject('CarbonCopy News! - ' . date('d-m-Y'));
            $this->email->message($message);

            $this->email->send();
        }

//        echo $this->email->print_debugger();
    }

    /**
     * Get actions that user is participant.
     * 
     * @param string $participant
     * @param string $interval
     * 
     * @return array
     */
    private function _actions_participating($participant, $interval)
    {
        $this->load->model('m_cron');

        $participating_actions = array();
        // Get context/topic participants.
        $all_activity = $this->m_cron->get_activity(NULL, $interval, 'all');

        foreach ($all_activity as $action) {
            $is_topic = is_null($action->id_topic) ? FALSE : TRUE;
            if ($is_topic) {
                $context = preg_replace('/[\/\/]{2,}/', '/', '_accounts/cc/contexts/' . $this->misc->unslug($action->context) . '/' . substr($action->id_topic, 1));
            }
            else {
                $context = preg_replace('/[\/\/]{2,}/', '/', '_accounts/cc/contexts/' . $this->misc->unslug($action->context) . '/' . $action->id_context);
            }

            $participants_context = Modules::run('account/participant/list_for_context'
                , $is_topic ? topic_real_path($context) : $context, $is_topic ? 'topic' : 'context');

            foreach ($participants_context as $participant_context) {
                if ($participant_context->info['id'] === $participant->info['id'] AND $participant->info['id'] !== $action->from_participant) {
                    $participating_actions[] = $action;
                }
            }
        }

        return $participating_actions;

        // TODO: view if better uses belongs_to.
        /*
         *     private function _actions_participating($participant, $interval)
          {
          $this->load->model('m_cron');

          $participating_actions = array();

          // Get context/topic participants.
          $all_activity = $this->m_cron->get_activity(NULL, $interval, 'all');

          foreach ($all_activity as $action) {
          $is_topic = is_null($action->id_topic) ? FALSE : TRUE;
          if ($is_topic) {
          $context = preg_replace('/[\/\/]{2,}/', '/', '_accounts/cc/contexts/' . $this->misc->unslug($action->context) . '/' . substr($action->id_topic, 1));

          belongs_to('topic', $context, $participant->info['id'], TRUE) ? $participating_actions[] = $action : NULL;
          }
          else {
          $context = preg_replace('/[\/\/]{2,}/', '/', '_accounts/cc/contexts/' . $this->misc->unslug($action->context) . '/' . $action->id_context);

          belongs_to('context', $context, $participant->info['id'], TRUE) ? $participating_actions[] = $action : NULL;
          }
          }

          return $participating_actions;
          }
         */
    }

    private function _tasks_notification($participant)
    {
        $this->load->model('m_cron');

        $all_tasks = $this->m_cron->get_future_tasks();

        foreach ($all_tasks as $task) {
            $context = preg_replace('/[\/\/]{2,}/', '/', '_accounts/cc/contexts/' . $this->misc->unslug($task->context) . '/' . substr($task->id_topic, 1));
            $participants_context = Modules::run('account/participant/list_for_context', topic_real_path($context), 'topic');

            foreach ($participants_context as $participant_context) {
                if ($participant_context->info['id'] === $participant->info['id'] AND $participant->info['id'] !== $task->from_participant) {
                    $tasks_participating[] = $task;
                }
            }
        }

        return $tasks_participating;
    }

}
